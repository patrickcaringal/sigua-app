import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { usePagination, useRequest } from "../../../../../hooks";
import { getAllQueuesReq } from "../../../../../modules/firebase";
import { formatTimeStamp } from "../../../../../modules/helper";
import { exportQueueList } from "../../../../../modules/pdf";
import {
  ACTION_ICONS,
  Input,
  PATHS,
  Pagination,
  getActionButtons,
} from "../../../../common";
import { AdminMainContainer } from "../../../../shared";
import CollapsibleRow from "./CollapsibleRow";
import FilterModal from "./FilterModal";
import useFilter from "./FilterModal/useFilter";

const defaultModal = {
  open: false,
  data: {},
};

const QueueManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getQueues] = useRequest(getAllQueuesReq, setBackdropLoader);

  // Local States
  const [queues, setQueues] = useState([]);
  const [filterModal, setFilterModal] = useState(defaultModal);
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

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  const handleFilterModalOpen = () => {
    setFilterModal({
      open: true,
      data: filtering.filters,
    });
  };

  const handleFilterModalClose = () => {
    setFilterModal(defaultModal);
  };

  const handleFilterApply = (filters) => {
    filtering.setFilters(filters);
  };

  const handleClearFilter = () => {
    filtering.clear();
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
            onClick={() => exportQueueList(filtering.filtered)}
            startIcon={ACTION_ICONS.EXPORT}
            // disabled={!filtering.filtered.length}
          >
            export
          </Button>
          <ButtonGroup variant="contained" size="small">
            <Button
              size="small"
              onClick={handleFilterModalOpen}
              startIcon={ACTION_ICONS.FILTER}
            >
              filters
            </Button>
            {!!filtering.hasFilter && (
              <Button size="small" onClick={handleClearFilter}>
                {ACTION_ICONS.CLEAR}
              </Button>
            )}
          </ButtonGroup>
        </>
      }
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

      {filterModal.open && (
        <FilterModal
          open={filterModal.open}
          data={filterModal.data}
          onApply={handleFilterApply}
          onClose={handleFilterModalClose}
        />
      )}
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
