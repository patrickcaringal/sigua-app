import React, { useEffect, useRef, useState } from "react";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { jsPDF } from "jspdf";
import { useRouter } from "next/router";
import { Bar } from "react-chartjs-2";

import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../../hooks";
import {
  getAllRecordsReq,
  getBranchesReq,
  getServicesReq,
} from "../../../../../modules/firebase";
import { formatTimeStamp } from "../../../../../modules/helper";
import { ACTION_ICONS, PATHS, chartplugin } from "../../../../common";
import { AdminMainContainer } from "../../../../shared";
import FilterModal from "./FilterModal";
import useFilter from "./FilterModal/useFilter";

const defaultModal = {
  open: false,
  data: {},
};

const customCanvasBackgroundColor = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#fff";
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  customCanvasBackgroundColor
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: "y",
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    ...chartplugin,
  },
};

const TopBranchesPage = () => {
  const ref = useRef(null);
  const router = useRouter();

  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getAllRecords] = useRequest(getAllRecordsReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [branches, setBranches] = useState([]);
  const [filterModal, setFilterModal] = useState(defaultModal);
  const filtering = useFilter({});
  const displayReport =
    !!filtering.filters.rangeDisplay &&
    !!filtering.filters.startDate &&
    !!filtering.filters.endDate;

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      const { data, error } = await getAllRecords();
      if (error) return openErrorDialog(error);

      filtering.setData(data);
      setMedicalRecords(data);
    };
    const fetchBranches = async () => {
      const { data, error } = await getBranches({ mapService: false });
      if (error) return openErrorDialog(error);

      setBranches(data);
    };

    fetchMedicalRecords();
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

  const generateReportData = () => {
    let s = branches.reduce((a, i) => {
      a[i.id] = {
        name: i.name,
        count: 0,
      };
      return a;
    }, {});

    filtering.filtered.forEach((i) => {
      if (s[i.branchId]) {
        s[i.branchId].count += 1;
      }
    });

    return s;
  };

  const reportData = generateReportData();

  const data = {
    labels: Object.values(reportData).reduce((a, i) => [...a, `${i.name}`], []),
    datasets: [
      {
        label: "Patients",
        data: Object.values(reportData).reduce((a, i) => [...a, i.count], []),
        backgroundColor: ["rgba(54, 162, 235, 0.7)"],
        borderColor: ["rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const handleExport = () => {
    const doc = new jsPDF({ orientation: "l" });

    doc.text(translateHeader(filtering.filters), 150, 15, null, null, "center");
    doc.addImage(ref.current.canvas, null, 25, 30, 240, 130);

    doc.output("pdfobjectnewwindow");
  };

  const translateHeader = ({ rangeDisplay, startDate, endDate }) => {
    let d =
      rangeDisplay === "permonth"
        ? formatTimeStamp(new Date(startDate), "MMMM yyyy")
        : rangeDisplay === "peryear"
        ? formatTimeStamp(new Date(startDate), "yyyy")
        : `${formatTimeStamp(
            new Date(startDate),
            "MMM dd, yyyy"
          )} - ${formatTimeStamp(new Date(endDate), "MMM dd, yyyy")}`;

    return `Top Branches ${d}`;
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Top Branches" }],
      }}
      toolbarContent={
        <>
          <Button
            onClick={handleExport}
            startIcon={ACTION_ICONS.EXPORT}
            disabled={!displayReport}
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 6 }}>
          {!!displayReport && translateHeader(filtering.filters)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {!!displayReport ? (
            <Box sx={{ height: 440, width: 800 }}>
              <Bar options={options} data={data} ref={ref} />
            </Box>
          ) : (
            <Typography
              variant="h4"
              color="text.secondary"
              fontWeight="bold"
              sx={{ flex: 1, textAlign: "center" }}
            >
              Select a filter
            </Typography>
          )}
        </Box>
      </Box>
      {filterModal.open && (
        <FilterModal
          open={filterModal.open}
          data={filterModal.data}
          branches={branches}
          onApply={handleFilterApply}
          onClose={handleFilterModalClose}
        />
      )}
    </AdminMainContainer>
  );
};

export default TopBranchesPage;
