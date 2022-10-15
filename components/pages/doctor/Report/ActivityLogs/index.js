import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../../hooks";
import { getLogsByMonthReq } from "../../../../../modules/firebase";
import { arrayStringify, formatTimeStamp } from "../../../../../modules/helper";
import { exportQueueList } from "../../../../../modules/pdf";
import {
  ACTION_ICONS,
  Input,
  PATHS,
  Pagination,
  TableContainer,
  getActionButtons,
} from "../../../../common";
import { AdminMainContainer } from "../../../../shared";

const ActivityLogPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getLogsByMonth] = useRequest(getLogsByMonthReq, setBackdropLoader);

  // Local States
  const [logs, setLogs] = useState([]);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      // Get Staffs
      const { data, error } = await getLogsByMonth();
      if (error) return openErrorDialog(error);
      // console.log(
      //   data.map((i) => ({
      //     action: i.action,
      //     resourceType: i.resourceType,
      //     resourceName: i.resourceName,
      //   }))
      // );
      setLogs(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(logs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Activity Logs" }],
      }}
      //   toolbarContent={
      //     <>
      //       <Box sx={{ width: 200 }}>
      //         <Input
      //           debounce
      //           label="Search"
      //           //   value={filtering.filters.name}
      //           //   onChange={handleSearchChange}
      //         />
      //       </Box>
      //     </>
      //   }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Date", sx: { width: 200 } },
                { text: "Actor", sx: { width: 200 } },
                { text: "Action", sx: { width: 100 } },
                // { text: "Resource Type", sx: { width: 140 } },
                { text: "Resource" },
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
            {filtering.filtered
              .slice(pagination.info.start, pagination.info.end)
              .map((i) => {
                const {
                  id,
                  actorName,
                  action = "",
                  date,
                  resourceName,
                  resourceType,
                } = i;

                const resource =
                  typeof resourceName == "string"
                    ? resourceName
                    : !!resourceName
                    ? arrayStringify(resourceName)
                    : "";

                return (
                  <TableRow key={id}>
                    <TableCell>
                      {formatTimeStamp(date, "MMM-dd-yyyy hh:mm")}
                    </TableCell>
                    <TableCell>{actorName}</TableCell>
                    <TableCell>{action}</TableCell>
                    {/* <TableCell>{resourceType}</TableCell> */}
                    <TableCell>
                      {resource ? `${resourceType}: ${resource}` : "-"}
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

export default ActivityLogPage;
