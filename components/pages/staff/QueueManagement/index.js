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
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addQueueReq,
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

  // console.log({ user, isStaff });

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueues] = useRequest(getQueuesReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [addQueue] = useRequest(addQueueReq, setBackdropLoader);

  // Local States
  const [queues, setQueues] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);

  useEffect(() => {
    const fetchQueues = async () => {
      // Get Services
      const { data: queueList, error: getQueuesError } = await getQueues();
      if (getQueuesError) return openErrorDialog(getQueuesError);

      const mappedQueue = queueList.map((i) => ({
        ...i,
        isToday: formatTimeStamp(i.date) === today,
      }));

      setQueues(mappedQueue);
      // queues.some(
      //   (i) => formatTimeStamp(i.date) === formatTimeStamp(new Date())
      // )
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

  const handleAddQueue = async (docs) => {
    docs = {
      ...docs,
      date: formatFirebasetimeStamp(docs.date),
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

    console.log(JSON.stringify(docs, null, 4));
    return;
    // Add
    const { data: newDoc, error: addError } = await addQueue({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setQueues((prev) => [...prev, newDoc]);
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
            disabled={queues.some((i) => i.isToday)}
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
              console.log(queues);
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
