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
  LOG_ACTIONS,
  RESOURCE_TYPE,
  addQueueCounterReq,
  addQueueReq,
  db,
  getBranchesReq,
  registerToQueueReq,
  resetQueueReq,
  saveLogReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  today,
} from "../../../../modules/helper";
import { PATHS, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import DoctorsModal from "../../staff/QueueToday/DoctorsModal";
import Header from "../../staff/QueueToday/Header";
import ManualRegistrationModal from "../../staff/QueueToday/ManualRegistrationModal";
import Placeholder from "../../staff/QueueToday/Placeholder";
import QueueComponent from "../../staff/QueueToday/QueueComponent";
import ManageQueueModal from "../../staff/QueueToday/QueueModal";
import ToolbarButtons from "../../staff/QueueToday/ToolbarButtons";
import TransferModal, {
  QUEUE_FLOW,
} from "../../staff/QueueToday/TransferModal";

const defaultModal = {
  open: false,
  data: {},
};

const QueueTodayPage = ({ branchId, openBranchModal }) => {
  const router = useRouter();
  const { user } = useAuth();
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
  const [registerToQueue] = useRequest(registerToQueueReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);
  const [doctorModal, setDoctorModal] = useState(defaultModal);
  const [transferModal, setTransferModal] = useState(defaultModal);
  // manual register
  const [manualRegModal, setManualRegModal] = useState(defaultModal);

  const isQueueFull = queueToday?.nextQueueNo - 1 === queueToday?.capacity;
  const hasQueueToday = !!lodash.keys(queueToday).length;
  const isRegOpen = hasQueueToday ? queueToday.openForRegistration : false;
  const isQueueOpen = hasQueueToday ? queueToday.openQueue : false;
  const doctorCounters = lodash.values(queueToday?.counters);
  const registeredPatients = hasQueueToday
    ? [
        ...queueToday?.queue,
        ...queueToday?.next,
        ...queueToday?.skipped,
        ...queueToday?.done,
        ...doctorCounters?.reduce((a, i) => [...a, ...i.queue], []),
      ]
    : [];

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
      where("branchId", "==", branchId), // prob
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
  }, [branchId]);

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
    const { data, error: addError } = await addQueue({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.CREATE,
      resourceType: RESOURCE_TYPE.QUEUE,
      resourceId: data.id,
      resourceName: `${data.branchName} ${data.queueDate}`,
      change: null,
    });

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

  const handleManualReg = async (document) => {
    // Validate
    const patientAlreadyHasQueue = !!registeredPatients.filter(
      (i) => i.patientId === document.patientId
    ).length;

    if (patientAlreadyHasQueue) {
      return openResponseDialog({
        autoClose: true,
        content: `${document.patientName} is already registered on today's queue.`,
        type: "WARNING",
      });
    }

    // Register
    const payload = { id: queueToday.id, document };
    const { error: regError } = await registerToQueue(payload);
    if (regError) return openErrorDialog(regError);

    // Successful
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: document.patientName,
        verb: "registered to the Queue",
      }),
      type: "SUCCESS",
      closeCb() {
        setManualRegModal(defaultModal);
      },
    });
  };

  const handleQueueModalOpen = () => {
    setQueueModal({
      open: true,
      data: {
        branchId: branchId,
        capacity: branches.find((i) => i.id === branchId).capacity,
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

  const handleManualRegModalOpen = () => {
    setManualRegModal({
      open: true,
      data: {
        queueId: queueToday.id,
        date: queueToday.date,
        branch: queueToday.branchName,
      },
    });
  };

  const handleManualRegModalClose = () => {
    setManualRegModal(defaultModal);
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
        <>
          <Button variant="outlined" size="small" onClick={openBranchModal}>
            Select Branch
          </Button>
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
          {isRegOpen && (
            <Button
              variant="contained"
              size="small"
              onClick={handleManualRegModalOpen}
              // startIcon={<AddCircleIcon />}
              // disabled={hasQueueToday}
            >
              Manual register
            </Button>
          )}
        </>
      }
    >
      {hasQueueToday ? (
        <>
          <span id="identifier" style={{ display: "none" }}>
            {queueToday?.id}
          </span>
          <Header
            branch={branchesMap[branchId]}
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
                enableFirstItemOnly
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
        <Placeholder branch={branchesMap[branchId]} />
      )}

      {queueModal.open && (
        <ManageQueueModal
          isStaff
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
          branchId={branchId}
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

      {manualRegModal.open && (
        <ManualRegistrationModal
          open={manualRegModal.open}
          data={manualRegModal.data}
          onClose={handleManualRegModalClose}
          onSave={handleManualReg}
        />
      )}
    </AdminMainContainer>
  );
};

export default QueueTodayPage;
