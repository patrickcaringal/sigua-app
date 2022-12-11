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
import { jsPDF } from "jspdf";
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
  DatePicker,
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await getLogsByMonth({ date: selectedDate });
      if (error) return openErrorDialog(error);
      setLogs(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

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

  const exportDisabled = filtering.filtered.length <= 0;

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Activity Logs" }],
      }}
      toolbarContent={
        <>
          <Button
            onClick={() => exportLogs(filtering.filtered)}
            startIcon={ACTION_ICONS.EXPORT}
            disabled={exportDisabled}
          >
            export
          </Button>
          <Box sx={{ width: 200 }}>
            <DatePicker
              closeOnSelect={true}
              label="Date"
              value={selectedDate}
              onChange={(value) => {
                const v = value ? formatTimeStamp(value) : new Date();
                setSelectedDate(v);
              }}
            />
          </Box>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Date", sx: { width: 200 } },
                { text: "Actor", sx: { width: 300 } },
                { text: "Action", sx: { width: 100 } },
                // { text: "Resource Type", sx: { width: 140 } },
                { text: "Activity" },
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
                      {formatTimeStamp(date, "MMM-dd-yyyy hh:mm a")}
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

const exportLogs = (data) => {
  var doc = new jsPDF();
  const baseX = 8;
  const baseY = 10;
  let movingY = baseY;

  const config = {
    autoSize: true,
    fontSize: 10,
    headerBackgroundColor: "#009FFE",
  };

  data = data.map((i) => {
    const { resourceName, resourceType, date, action, actorName } = i;
    const resource =
      typeof resourceName == "string"
        ? resourceName
        : !!resourceName
        ? arrayStringify(resourceName)
        : "";

    return {
      date: formatTimeStamp(date, "MMM-dd-yyyy hh:mm a"),
      action,
      actorName,
      resource: resource ? `${resourceType}: ${resource}` : "-",
    };
  });

  const thead = [
    {
      name: "date",
      prompt: "Date",
    },
    {
      name: "actorName",
      prompt: "Actor",
    },
    {
      name: "action",
      prompt: "Action",
    },
    {
      name: "resource",
      prompt: "Activity",
    },
  ];

  doc.setFont(undefined, "bold");
  doc.setFontSize(16);

  doc.text(
    `Activity Logs ${formatTimeStamp(data?.[0]?.date, "MMMM dd, yyyy")}`,
    baseX,
    movingY
  );

  movingY += 10;

  doc.table(baseX, movingY, data, thead, config);
  doc.output("pdfobjectnewwindow");
};

export default ActivityLogPage;
