import React, { useEffect, useState } from "react";

import { Box, Button } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addQueueCounterReq,
  addQueueReq,
  db,
  getBranchesReq,
  resetQueueReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  pluralize,
  today,
} from "../../../../modules/helper";
import { PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import DoctorList from "./DoctorList";
import DoctorsModal from "./DoctorsModal";
import DoneList from "./DoneList";
import Header from "./Header";
import Placeholder from "./Placeholder";
import QueueComponent from "./QueueComponent";
import QueueList from "./QueueList";
import ManageQueueModal from "./QueueModal";
import SkippedList from "./SkippedList";
import ToolbarButtons from "./ToolbarButtons";
import TransferModal, { QUEUE_FLOW } from "./TransferModal";

const defaultModal = {
  open: false,
  data: {},
};

const QueueManagementPage = () => {
  const router = useRouter();
  const { user, isStaff } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [addQueue] = useRequest(addQueueReq, setBackdropLoader);
  const [updateQueueRegStatus] = useRequest(
    updateQueueRegStatusReq,
    setBackdropLoader
  );
  const [updateQueueStatus] = useRequest(
    updateQueueStatusReq,
    setBackdropLoader
  );
  const [addQueueCounter] = useRequest(addQueueCounterReq, setBackdropLoader);
  const [transferQueueItem] = useRequest(
    transferQueueItemReq,
    setBackdropLoader
  );
  const [resetQueue] = useRequest(resetQueueReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);
  const [doctorModal, setDoctorModal] = useState(defaultModal);
  const [transferModal, setTransferModal] = useState(defaultModal);

  const isQueueFull = queueToday?.nextQueueNo - 1 === queueToday?.capacity;
  const hasQueueToday = !!lodash.keys(queueToday).length;
  const isRegOpen = hasQueueToday ? queueToday.openForRegistration : false;
  const isQueueOpen = hasQueueToday ? queueToday.openQueue : false;
  const doctorCounters = lodash.values(queueToday?.counters);

  useEffect(() => {
    const fetchBranches = async () => {
      // Get Branches
      const {
        data: branchList,
        map: branchMap,
        error: getBranchError,
      } = await getBranches({ mapService: false });
      if (getBranchError) return openErrorDialog(getBranchError);

      setBranches(
        branchList.map((i) => ({
          ...lodash.pick(i, ["name", "id", "capacity"]),
        }))
      );
      setBranchesMap(branchMap);
    };

    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "queues"),
      where("branchId", "==", user.branch), // prob
      where("queueDate", "==", today)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length === 1) {
        const realtimeData = querySnapshot.docs[0].data();
        setQueueToday(realtimeData);
      } else if (querySnapshot.docs.length > 1) {
        alert("detected more than 1 queue today");
        setQueueToday({});
      } else {
        setQueueToday({});
      }
    });

    return () => unsub();
  }, [user.branch]);

  const handleAddQueue = async (docs) => {
    docs = {
      ...docs,
      branchName: branchesMap[docs.branchId],
      date: formatFirebasetimeStamp(docs.date),
      queueDate: formatTimeStamp(docs.date),
      queue: [],
      next: [],
      counters: {},
      done: [],
      skipped: [],
      doctors: [],
      nextQueueNo: 1,
      createdBy: user.id,
      openForRegistration: false,
      openQueue: false,
    };

    // Add
    const { error: addError } = await addQueue({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Queue",
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setQueueModal(defaultModal);
      },
    });
  };

  const handleRegStatus = async () => {
    const document = {
      id: queueToday.id,
      openForRegistration: !queueToday.openForRegistration,
    };

    // Update status
    const payload = { document };
    const { error: updateError } = await updateQueueRegStatus(payload);
    if (updateError) return openErrorDialog(updateError);
  };

  const handleQueueStatus = async () => {
    const document = {
      id: queueToday.id,
      openQueue: !queueToday.openQueue,
    };

    // Update status
    const payload = { document };
    const { error: updateError } = await updateQueueStatus(payload);
    if (updateError) return openErrorDialog(updateError);
  };

  const handleAddDoctorCounter = async (doctor) => {
    doctor = {
      ...doctor,
      queue: [],
    };

    // Update
    const payload = { id: queueToday.id, document: doctor };
    const { error: updateError } = await addQueueCounter(payload);
    if (updateError) return openErrorDialog(updateError);
  };

  const handleTransferSelect = async ({ patient, doctor, from, to, flow }) => {
    // console.log({ patient, doctor, from, to, flow });
    // return;

    if (flow === QUEUE_FLOW.QUEUE_NEXT && queueToday?.next?.length === 3) {
      return openResponseDialog({
        autoClose: true,
        content: `Only 3 Patients allowed for Next queue `,
        type: "WARNING",
      });
    }

    if (
      flow === QUEUE_FLOW.NEXT_DOCTOR &&
      queueToday.counters[doctor.id].queue.length
    ) {
      return openResponseDialog({
        autoClose: true,
        content: `Dr. ${doctor.name} not yet available.`,
        type: "WARNING",
      });
    }

    // Update
    const payload = { id: queueToday.id, document: patient, from, to };
    const { error: updateError } = await transferQueueItem(payload);
    if (updateError) return openErrorDialog(updateError);
  };

  const handleQueueModalOpen = () => {
    setQueueModal({
      open: true,
      data: {
        branchId: user.branch,
        capacity: branches.find((i) => i.id === user.branch).capacity,
      },
    });
  };

  const handleQueueModalClose = () => {
    setQueueModal(defaultModal);
  };

  const handleDoctorModalOpen = () => {
    if (doctorCounters.length == 2) {
      return openResponseDialog({
        autoClose: true,
        content: "Max of 2 Doctors only",
        type: "WARNING",
      });
    }

    setDoctorModal({
      open: true,
      data: null,
    });
  };

  const handleDoctorModalClose = () => {
    setDoctorModal(defaultModal);
  };

  const handleTransferModalOpen = (data) => {
    setTransferModal({
      open: true,
      data,
    });
  };

  const handleTransferModalClose = () => {
    setTransferModal(defaultModal);
  };

  const handleResetQueue = async () => {
    const payload = { id: queueToday.id };
    const { error: resetError } = await resetQueue(payload);
    if (resetError) return openErrorDialog(resetError);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Queue Today" }],
      }}
      toolbarContent={
        <ToolbarButtons
          hasQueueToday={hasQueueToday}
          // hasDoctor={!!doctorCounters.length}
          doctors={doctorCounters.length}
          isQueueFull={isQueueFull}
          isRegOpen={isRegOpen}
          isQueueOpen={isQueueOpen}
          onRegStatus={handleRegStatus}
          onQueueStatus={handleQueueStatus}
          onResetQueue={handleResetQueue}
          onDoctorModalOpen={handleDoctorModalOpen}
          onQueueModalOpen={handleQueueModalOpen}
        />
      }
    >
      {hasQueueToday ? (
        <>
          <Header
            branch={branchesMap[user.branch]}
            date={queueToday.date}
            registered={queueToday.nextQueueNo - 1}
            capacity={queueToday.capacity}
            isQueueFull={isQueueFull}
            isRegOpen={isRegOpen}
            isQueueOpen={isQueueOpen}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 3,
              mx: 2,
              mt: 3,
            }}
          >
            <Box
              sx={{
                flex: 1,
                // border: "1px solid red",
                display: "grid",
                gridTemplateRows: "calc((100vh - 260px) / 2) auto",
                gap: 3,
                height: "calc(100vh - 260px)",
              }}
            >
              <QueueComponent
                disabled={!isQueueOpen}
                enableFirstItemOnly
                queueKey="queue"
                title="QUEUE"
                queue={queueToday.queue.sort((a, b) => a.queueNo - b.queueNo)}
                onTransferClick={handleTransferModalOpen}
              />
              <QueueComponent
                disabled={!isQueueOpen}
                queueKey="next"
                title="NEXT"
                queue={queueToday.next}
                onTransferClick={handleTransferModalOpen}
              />
            </Box>

            {/* Doctor List */}
            <Box
              sx={{
                flex: 1,
                // border: "1px solid red",
                display: "grid",
                gridTemplateRows: `calc((100vh - 260px) / ${doctorCounters.length}) auto`,
                gap: 3,
                height: "calc(100vh - 260px)",
              }}
            >
              {doctorCounters.map((i) => (
                <QueueComponent
                  disabled={!isQueueOpen}
                  key={i.id}
                  queueKey={`counters.${i.id}.queue`}
                  title={`Dr. ${i.name}`}
                  queue={i.queue}
                  onTransferClick={handleTransferModalOpen}
                />
              ))}
            </Box>

            <Box
              sx={{
                flex: 1,
                // border: "1px solid red",
                display: "grid",
                gridTemplateRows: "calc((100vh - 260px) / 2) auto",
                gap: 3,
                height: "calc(100vh - 260px)",
              }}
            >
              <QueueComponent
                disabled={!isQueueOpen}
                queueKey="done"
                title="DONE"
                queue={queueToday.done}
                onTransferClick={handleTransferModalOpen}
              />
              <QueueComponent
                disabled={!isQueueOpen}
                queueKey="skipped"
                title="SKIPPED"
                queue={queueToday.skipped}
                onTransferClick={handleTransferModalOpen}
              />
            </Box>
          </Box>
        </>
      ) : (
        <Placeholder />
      )}

      {queueModal.open && (
        <ManageQueueModal
          isStaff={isStaff}
          branches={branches}
          open={queueModal.open}
          data={queueModal.data}
          onClose={handleQueueModalClose}
          onSave={!queueModal.data?.id ? handleAddQueue : handleEditQueue}
        />
      )}

      {doctorModal.open && (
        <DoctorsModal
          open={doctorModal.open}
          branchId={user.branch}
          queueDoctors={lodash.keys(queueToday?.counters)}
          onDoctorSelect={handleAddDoctorCounter}
          onClose={handleDoctorModalClose}
        />
      )}

      {transferModal.open && (
        <TransferModal
          open={transferModal.open}
          data={transferModal.data}
          doctors={doctorCounters}
          onTransferSelect={handleTransferSelect}
          onClose={handleTransferModalClose}
        />
      )}
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
