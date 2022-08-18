import React, { Fragment, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueueIcon from "@mui/icons-material/Queue";
import RestoreIcon from "@mui/icons-material/Restore";
import StopIcon from "@mui/icons-material/Stop";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
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
  getQueuesReq,
  resetQueueReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  localUpdateDocs,
  pluralize,
  today,
} from "../../../../modules/helper";
import { PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import DoctorsModal from "./DoctorsModal";
import Header from "./Header";
import Placeholder from "./Placeholder";
import QueueList from "./QueueList";
import ManageQueueModal from "./QueueModal";
import ToolbarButtons from "./ToolbarButtons";

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
  const [resetQueue] = useRequest(resetQueueReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);
  const [doctorModal, setDoctorModal] = useState(defaultModal);

  const hasQueueToday = !!lodash.keys(queueToday).length;
  const isRegOpen = hasQueueToday ? queueToday.openForRegistration : false;
  const isQueueOpen = hasQueueToday ? queueToday.openQueue : false;

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
      counters: [
        // {
        //   id: 'docId',
        //   ongoing: {}
        // }
      ],
      done: [],
      skipped: [],
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

  const handleDoctorSelect = async (doctor) => {
    // Update status
    const payload = { id: queueToday.id, document: doctor };
    const { error: updateError } = await addQueueCounter(payload);
    if (updateError) return openErrorDialog(updateError);
  };

  const handleEditQueue = async (updatedDocs) => {};

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
    setDoctorModal({
      open: true,
      data: null,
    });
  };

  const handleDoctorModalClose = () => {
    setDoctorModal(defaultModal);
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
          <ToolbarButtons
            hasQueueToday={hasQueueToday}
            isRegOpen={isRegOpen}
            isQueueOpen={isQueueOpen}
            onRegStatus={handleRegStatus}
            onQueueStatus={handleQueueStatus}
            onResetQueue={handleResetQueue}
            onQueueModalOpen={handleQueueModalOpen}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleDoctorModalOpen}
          >
            add doctor
          </Button>
        </>
      }
    >
      {hasQueueToday ? (
        <>
          <Header
            branch={branchesMap[user.branch]}
            date={queueToday.date}
            registered={queueToday.nextQueueNo - 1}
            capacity={queueToday.capacity}
            isRegOpen={isRegOpen}
            isQueueOpen={isQueueOpen}
          />
          <QueueList queue={queueToday.queue} />
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
          queueDoctors={queueToday.counters.map((i) => i.id)}
          onDoctorSelect={handleDoctorSelect}
          onClose={handleDoctorModalClose}
        />
      )}
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
