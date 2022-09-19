import React, { useEffect, useState } from "react";

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
  getQueuesByBranchReq,
  updateServiceReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  localUpdateDocs,
  pluralize,
  today,
} from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  PATHS,
  confirmMessage,
  getActionButtons,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import ManageQueueModal from "./QueueModal";
import TableCells from "./TableCells";

const QueueManagementPage = () => {
  const router = useRouter();
  const { user, isStaff } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueues] = useRequest(getQueuesByBranchReq, setBackdropLoader);

  // Local States
  const [queues, setQueues] = useState([]);

  useEffect(() => {
    const fetchQueues = async () => {
      // Get Queues
      const payload = { id: user.branch };
      const { data: queueList, error: getError } = await getQueues(payload);
      if (getError) return openErrorDialog(getError);

      setQueues(queueList);
    };

    fetchQueues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewQueueDetail = (id) => {
    router.push({
      pathname: PATHS.STAFF.QUEUE_DETAIL,
      query: { id },
    });
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Queue" }],
      }}
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Date", sx: { width: 140 } },
                { text: "Day", sx: { width: 140 } },
                { text: "Doctor" },
                {
                  text: "Capacity",
                  sx: { width: 200 },
                  align: "right",
                },
                {
                  text: "Registered",
                  sx: { width: 200 },
                  align: "right",
                },
                {
                  text: "Served Patients",
                  sx: { width: 200 },
                  align: "right",
                },
                {
                  text: "No Show Patients",
                  sx: { width: 200 },
                  align: "right",
                },
                // { text: "Status", align: "center", sx: { width: 110 } },
                { text: "Actions", sx: { width: 100 }, align: "center" },
              ].map(({ text, align, sx }) => (
                <TableCell
                  key={text}
                  {...(align && { align })}
                  {...(sx && { sx: { ...sx, fontWeight: "bold", p: 2 } })}
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
                    {getActionButtons([
                      {
                        action: ACTION_BUTTONS.DETAILS_QUEUE,
                        tooltipText: "Queue Details",
                        onClick: () => handleViewQueueDetail(i.id),
                      },
                    ])}
                  </TableCell>
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
