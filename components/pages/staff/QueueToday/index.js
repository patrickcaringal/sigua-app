import React, { Fragment, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  addQueueReq,
  db,
  deleteServiceReq,
  getBranchesReq,
  getQueuesReq,
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
import Placeholder from "./Placeholder";
import ManageQueueModal from "./QueueModal";

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
  const [getQueues] = useRequest(getQueuesReq, setBackdropLoader);
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

  // Local States
  // const [queues, setQueues] = useState([]);
  const [queueToday, setQueueToday] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);

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
    console.log("went here");
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
        // console.log("no queue");
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

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Queue Today" }],
      }}
      toolbarContent={
        <>
          {hasQueueToday && (
            <>
              <Button
                variant={isRegOpen ? "outlined" : "contained"}
                size="small"
                onClick={handleRegStatus}
                startIcon={
                  isRegOpen ? <VisibilityOffIcon /> : <VisibilityIcon />
                }
                sx={{ mr: 2 }}
              >
                {`${isRegOpen ? "close" : "open"}`} registration
              </Button>

              <Button
                variant={isQueueOpen ? "outlined" : "contained"}
                size="small"
                onClick={handleQueueStatus}
                startIcon={isQueueOpen ? <StopIcon /> : <PlayArrowIcon />}
                sx={{ mr: 2 }}
              >
                {`${isQueueOpen ? "stop" : "start"}`} queue
              </Button>
            </>
          )}
          <Button
            variant="contained"
            size="small"
            onClick={handleQueueModalOpen}
            startIcon={<AddCircleIcon />}
            disabled={hasQueueToday}
          >
            add queue
          </Button>
        </>
      }
    >
      {hasQueueToday ? (
        <>
          <Box sx={{ m: 2, display: "flex", flexDirection: "row", gap: 6 }}>
            <Box
              sx={{
                display: "grid",
                grid: "auto-flow / 0fr 1fr",
                alignItems: "center",
                rowGap: 1,
              }}
            >
              {[
                {
                  label: "Branch",
                  value: branchesMap[user.branch],
                },
                {
                  label: "Date",
                  value: formatTimeStamp(queueToday.date, "MMM dd, yyyy (eee)"),
                },
              ].map(({ label, value }, index) => (
                <Fragment key={index}>
                  <Box sx={{ minWidth: 100 }}>{label}</Box>
                  <Box sx={{ fontWeight: "500" }}>{value}</Box>
                </Fragment>
              ))}
            </Box>

            <Box
              sx={{
                display: "grid",
                grid: "auto-flow / 0fr 1fr",
                alignItems: "center",
                rowGap: 1,
              }}
            >
              {[
                {
                  label: "Status",
                  value: (
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                      {isRegOpen ? (
                        <Chip
                          label="Registration Open"
                          color="primary"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Registration Close"
                          color="warning"
                          size="small"
                        />
                      )}
                      {isQueueOpen ? (
                        <Chip
                          label="Queue Ongoing"
                          color="primary"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="Queue Close"
                          color="warning"
                          size="small"
                        />
                      )}
                    </Box>
                  ),
                },
                {
                  label: "Capacity",
                  value: `0 / ${queueToday.capacity}`,
                },
              ].map(({ label, value }, index) => (
                <Fragment key={index}>
                  <Box sx={{ minWidth: 100 }}>{label}</Box>
                  <Box sx={{ fontWeight: "500" }}>{value}</Box>
                </Fragment>
              ))}
            </Box>
          </Box>

          {/* <Box>
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="1" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Patrick Angelo Caringal"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Blood sugar count
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider component="li" />
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="2" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Allyza Choie Denise Cos"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        ECG
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Box> */}
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
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
