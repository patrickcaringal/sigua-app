import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import faker from "faker";
import { jsPDF } from "jspdf";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../../hooks";
import { getAllQueuesReq } from "../../../../../modules/firebase";
import { formatTimeStamp } from "../../../../../modules/helper";
import {
  ACTION_BUTTONS,
  Input,
  PATHS,
  Pagination,
  getActionButtons,
} from "../../../../common";
import { AdminMainContainer } from "../../../../shared";
import CollapsibleRow from "./CollapsibleRow";

const QueueManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueues] = useRequest(getAllQueuesReq, setBackdropLoader);

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
    window.print();
    // router.push({
    //   pathname: PATHS.DOCTOR.QUEUE_DETAIL,
    //   query: { id },
    // });
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

  const doPDF = () => {
    // const data = queues.filter((i) => i.queueDate == "2022-09-20");
    const data = queues;
    console.log(queues);

    let doc = new jsPDF();
    const baseX = 8;

    data.forEach((i) => {
      doc.setFontSize(10);

      // header
      doc.text("Date:", baseX, 10);
      doc.text(formatTimeStamp(i.date, "MMM-dd-yyyy eeee"), baseX + 10, 10);

      doc.text("Branch:", baseX, 15);
      doc.text(i.branchName, baseX + 14, 15);

      const registered = i.nextQueueNo - 1;
      doc.text("Patients: ", baseX, 20);
      doc.text(`${registered} / ${i.capacity}`, baseX + 16, 20);

      doc.text("Doctors:", baseX + 60, 10);
      let y = 5;
      lodash
        .values(i.counters)
        .map((i) => i.name)
        .forEach((j) => {
          y += 5;
          doc.text(j || "-", baseX + 60 + 16, y);
        });

      // Patient list

      doc.text(`Served Patients (${i.done.length})`, baseX, 30);
      y = 32;
      i.done.forEach((j, idx) => {
        y += 5;
        doc.text(`${idx + 1}. ${j.patientName} - ${j.serviceName}`, baseX, y);
      });
      // [...Array(80).keys()].forEach((j, idx) => {
      //   y += 5;
      //   doc.text(`${idx + 1}. ${faker.name.findName()}`, baseX, y);
      // });

      doc.text(`No Show Patients (${i.skipped.length})`, baseX + 100, 30);
      y = 32;
      i.skipped.forEach((j, idx) => {
        y += 5;
        doc.text(
          `${idx + 1}. ${j.patientName} - ${j.serviceName}`,
          baseX + 100,
          y
        );
      });

      doc.addPage();
    });

    // doc.addPage();

    // // header
    // doc.text("Date", 8, 10);
    // doc.text("Branch", 8, 15);
    // doc.text("Patients", 8, 20);

    // doc.save("a4.pdf");
    // doc.autoPrint();
    doc.output("pdfobjectnewwindow"); //opens the data uri in new window
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Queue" }],
      }}
      toolbarContent={<Button onClick={doPDF}>PDF</Button>}
    >
      <TableContainer
        sx={{
          maxHeight: "calc(100vh - 64px - 64px - 16px - 77px)",
          overflow: "overlay",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell />
              {[
                { text: "Date", sx: { width: 140 } },
                { text: "Day", sx: { width: 140 } },
                { text: "Branch", sx: { width: 140 } },
                // { text: "Doctor" },
                {
                  text: "Patients",
                },
                // {
                //   text: "Registered",
                //   sx: { width: 200 },
                //   align: "right",
                // },
                // {
                //   text: "Served Patients",
                //   sx: { width: 200 },
                //   align: "right",
                // },
                // {
                //   text: "No Show Patients",
                //   sx: { width: 200 },
                //   align: "right",
                // },
                // { text: "Status", align: "center", sx: { width: 110 } },
                // { text: "Actions", sx: { width: 100 }, align: "center" },
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
                  // <TableRow key={i.id} id={i.id}>
                  //   <TableCells data={i} />
                  //   {/* <TableCell align="center">
                  //     {getActionButtons([
                  //       {
                  //         action: ACTION_BUTTONS.DETAILS_QUEUE,
                  //         tooltipText: "Queue Details",
                  //         onClick: () => handleViewQueueDetail(i.id),
                  //       },
                  //     ])}
                  //   </TableCell> */}
                  // </TableRow>
                  <CollapsibleRow key={i.id} data={i} />
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
