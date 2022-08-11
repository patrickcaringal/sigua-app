import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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
  updateServiceReq,
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
import ManageQueueModal from "./QueueModal";
import TableCells from "./TableCells";

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

  // Local States
  const [queues, setQueues] = useState([]);
  const [queueToday, setQueueToday] = useState();
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);

  useEffect(() => {
    const fetchQueues = async () => {
      // Get Services
      const { data: queueList, error: getQueuesError } = await getQueues();
      if (getQueuesError) return openErrorDialog(getQueuesError);

      const mappedQueue = queueList.map((i) => {
        const isToday = formatTimeStamp(i.date) === today;
        if (isToday) {
          setQueueToday(i);
        }

        return i;
      });

      setQueues(queueList);
    };

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
    fetchQueues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   console.log("went here");
  //   const q = query(
  //     collection(db, "queues"),
  //     where("branchId", "==", user.branch),
  //     where("queueDate", "==", today)
  //   );
  //   const unsub = onSnapshot(q, (querySnapshot) => {
  //     if (querySnapshot.docs.length === 1) {
  //       const realtimeData = querySnapshot.docs[0].data();

  //       const { latestDocs, updates } = localUpdateDocs({
  //         updatedDoc: realtimeData,
  //         oldDocs: [...queues],
  //       });

  //       // setQueues(latestDocs);
  //     }
  //   });

  //   return () => unsub();
  // }, [user.branch, queues]);

  const handleAddQueue = async (docs) => {
    docs = {
      ...docs,
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
      createdBy: user.id,
      openForRegistration: false,
    };

    // Add
    const { data: newDoc, error: addError } = await addQueue({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setQueues((prev) => [newDoc, ...prev]);
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
        paths: [{ text: "Queue" }],
      }}
      toolbarContent={
        <>
          <Button
            variant="contained"
            size="small"
            onClick={handleQueueModalOpen}
            startIcon={<AddCircleIcon />}
            disabled={!!queueToday}
          >
            add queue
          </Button>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Date", sx: { width: 200 } },
                { text: "Capacity" },
                { text: "Status", align: "center", sx: { width: 110 } },
                { text: "Actions", align: "center", sx: { width: 110 } },
              ].map(({ text, align, sx }) => (
                <TableCell
                  key={text}
                  {...(align && { align })}
                  {...(sx && { sx: { ...sx, fontWeight: "bold" } })}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {queues.map((i) => {
              return (
                <TableRow key={i.id}>
                  <TableCells data={i} />
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      // onClick={() => handleEditServiceModalOpen(i)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      // onClick={() => handleDeleteConfirm(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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
