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

const QueueManagementPage = () => {
  const router = useRouter();
  const { user, isStaff } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueues] = useRequest(getQueuesReq, setBackdropLoader);

  // Local States
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      // Get
      const { data: queueList, error: getQueuesError } = await getQueues();
      if (getQueuesError) return openErrorDialog(getQueuesError);

      setQueues(queueList);
    };

    fetchQueues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Queue" }],
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Date", sx: { width: 120 } },
                { text: "Day", sx: { width: 100 } },
                { text: "Doctor" },
                {
                  text: "Capacity",
                  sx: { width: 100 },
                  align: "center",
                },
                {
                  text: "Registered",
                  sx: { width: 200 },
                  align: "center",
                },
                {
                  text: "Served Patients",
                  sx: { width: 200 },
                  align: "center",
                },
                {
                  text: "No Show Patients",
                  sx: { width: 200 },
                  align: "center",
                },
                // { text: "Status", align: "center", sx: { width: 110 } },
                // { text: "Actions", align: "center", sx: { width: 110 } },
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
                  {/* <TableCell align="center">
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
                  </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
