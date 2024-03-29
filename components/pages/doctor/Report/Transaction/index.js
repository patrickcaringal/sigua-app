import React, { useCallback, useEffect, useState } from "react";

import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { endOfYear, isThisYear, startOfYear } from "date-fns";
import { useRouter } from "next/router";

import { useAuth } from "../../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { usePagination, useRequest } from "../../../../../hooks";
import {
  getAllQueuesReq,
  getBranchesReq,
} from "../../../../../modules/firebase";
import { formatTimeStamp } from "../../../../../modules/helper";
import {
  exportPatientPerDay,
  exportPatientPerMonth,
  exportPatientPerWeek,
} from "../../../../../modules/pdf";
import {
  ACTION_ICONS,
  Input,
  PATHS,
  Pagination,
  TableContainer,
  getActionButtons,
} from "../../../../common";
import { AdminMainContainer } from "../../../../shared";
import CollapsibleRow from "./CollapsibleRow";
import FilterModal from "./FilterModal";
import useFilter from "./FilterModal/useFilter";
import PerCustomTable, {
  compute as PerCustomCompute,
} from "./Tables/PerCustom";
import PerMonthTable, { compute as PerMonthCompute } from "./Tables/PerMonth";
import PerWeekTable, { compute as PerWeekCompute } from "./Tables/PerWeek";

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
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [queues, setQueues] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filterModal, setFilterModal] = useState(defaultModal);
  const filtering = useFilter({
    rangeDisplay: "permonth",
    startDate: formatTimeStamp(startOfYear(new Date())),
    endDate: formatTimeStamp(
      isThisYear(new Date()) ? new Date() : endOfYear(new Date())
    ),
  });

  const pagination = usePagination(filtering.filtered);
  const exportDisabled =
    !filtering.filters.rangeDisplay ||
    !filtering.filters.startDate ||
    !filtering.filters.endDate;

  useEffect(() => {
    const fetchQueues = async () => {
      // Get Queues
      const { data, error } = await getQueues();
      if (error) return openErrorDialog(error);

      setQueues(data);
      // filtering.setData(data);
    };

    const fetchBranches = async () => {
      // Get Branches
      const { data, error } = await getBranches({ mapService: false });
      if (error) return openErrorDialog(error);

      setBranches(data);
    };

    fetchQueues();
    fetchBranches();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        paths: [{ text: "Patients Year to date" }],
      }}
      toolbarContent={
        <>
          <Button
            onClick={() => {
              if (filtering.filters.rangeDisplay === "permonth") {
                const data = PerMonthCompute({
                  branches,
                  data: queues,
                  start: filtering.filters.startDate,
                  end: filtering.filters.endDate,
                });
                exportPatientPerMonth({
                  start: filtering.filters.startDate,
                  branches,
                  ...data,
                });
              } else if (filtering.filters.rangeDisplay === "perweek") {
                const data = PerWeekCompute({
                  branches,
                  data: queues,
                  start: filtering.filters.startDate,
                  end: filtering.filters.endDate,
                });
                exportPatientPerWeek({
                  start: filtering.filters.startDate,
                  branches,
                  ...data,
                });
              } else if (filtering.filters.rangeDisplay === "custom") {
                const data = PerCustomCompute({
                  branches,
                  data: queues,
                  start: filtering.filters.startDate,
                  end: filtering.filters.endDate,
                });
                exportPatientPerDay({
                  start: filtering.filters.startDate,
                  end: filtering.filters.endDate,
                  branches,
                  ...data,
                });
              }
            }}
            startIcon={ACTION_ICONS.EXPORT}
            disabled={exportDisabled}
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
      {filtering.filters.rangeDisplay === "permonth" && (
        <PerMonthTable
          data={queues}
          branches={branches}
          start={filtering.filters.startDate}
          end={filtering.filters.endDate}
        />
      )}
      {filtering.filters.rangeDisplay === "perweek" && (
        <PerWeekTable
          data={queues}
          branches={branches}
          start={filtering.filters.startDate}
          end={filtering.filters.endDate}
        />
      )}
      {filtering.filters.rangeDisplay === "custom" && (
        <PerCustomTable
          data={queues}
          branches={branches}
          start={filtering.filters.startDate}
          end={filtering.filters.endDate}
        />
      )}
      {/* <Pagination pagination={pagination} onChange={handlePageChange} /> */}

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
