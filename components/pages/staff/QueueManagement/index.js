import React, { useCallback, useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import { getQueuesByBranchReq } from "../../../../modules/firebase";
import {
  ACTION_BUTTONS,
  Input,
  PATHS,
  Pagination,
  getActionButtons,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import TableCells from "./TableCells";

const QueueManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueues] = useRequest(getQueuesByBranchReq, setBackdropLoader);

  // Local States
  const [queues, setQueues] = useState([]);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetchQueues = async () => {
      // Get Queues
      const payload = { id: user.branch };
      const { data: queueList, error: getError } = await getQueues(payload);
      if (getError) return openErrorDialog(getError);

      setQueues(queueList);
      filtering.setData(queueList);
    };

    fetchQueues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleViewQueueDetail = (id) => {
    router.push({
      pathname: PATHS.STAFF.QUEUE_DETAIL,
      query: { id },
    });
  };

  const handleSearchChange = useCallback(
    (e) => {
      pagination.goToPage(0);
      filtering.onNameChange(e?.target?.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.goToPage, filtering.onNameChange]
  );

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Queue" }],
      }}
      // toolbarContent={
      //   <Box sx={{ width: 200 }}>
      //     <Input
      //       debounce
      //       label="Search"
      //       value={filtering.filters.name}
      //       onChange={handleSearchChange}
      //     />
      //   </Box>
      // }
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
            {filtering.filtered
              .slice(pagination.info.start, pagination.info.end)
              .map((i) => {
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
      <Pagination pagination={pagination} onChange={handlePageChange} />
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
