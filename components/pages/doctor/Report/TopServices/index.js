import React, { useEffect, useRef, useState } from "react";

import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { jsPDF } from "jspdf";
import { useRouter } from "next/router";
import { Doughnut } from "react-chartjs-2";

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
  ArcElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  customCanvasBackgroundColor
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
    },
    ...chartplugin,
  },
};

const QueueManagementPage = () => {
  const ref = useRef(null);
  const router = useRouter();

  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getAllRecords] = useRequest(getAllRecordsReq, setBackdropLoader);
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [services, setServices] = useState([]);
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

    const fetchServices = async () => {
      const { data, error } = await getServices();
      if (error) return openErrorDialog(error);

      setServices(data);
    };

    const fetchBranches = async () => {
      const { data, error } = await getBranches({ mapService: false });
      if (error) return openErrorDialog(error);

      setBranches(data);
    };

    fetchMedicalRecords();
    fetchServices();
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
    let s = services.reduce((a, i) => {
      a[i.id] = {
        name: i.name,
        count: 0,
      };
      return a;
    }, {});

    filtering.filtered.forEach((i) => {
      if (s[i.serviceId]) {
        s[i.serviceId].count += 1;
      }
    });

    return s;
  };

  const reportData = generateReportData();

  const data = {
    labels: Object.values(reportData).reduce(
      (a, i) => [...a, `${i.name}: ${i.count} Patients`],
      []
    ),
    datasets: [
      {
        label: "# of Votes",
        data: Object.values(reportData).reduce((a, i) => [...a, i.count], []),
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const handleExport = () => {
    const doc = new jsPDF({ orientation: "l" });

    doc.text(translateHeader(filtering.filters), 150, 15, null, null, "center");
    doc.addImage(ref.current.canvas, null, 25, 30, 220, 130);

    doc.output("pdfobjectnewwindow");
  };

  const translateHeader = ({ branch, rangeDisplay, startDate, endDate }) => {
    const b =
      branch !== "-"
        ? branches.find((i) => i.id === branch)?.name
        : "All Branches";

    let d =
      rangeDisplay === "permonth"
        ? formatTimeStamp(new Date(startDate), "MMMM yyyy")
        : rangeDisplay === "peryear"
        ? formatTimeStamp(new Date(startDate), "yyyy")
        : `${formatTimeStamp(
            new Date(startDate),
            "MMM dd, yyyy"
          )} - ${formatTimeStamp(new Date(endDate), "MMM dd, yyyy")}`;

    return `Top Services ${d} ${b}`;
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Top Services" }],
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
            // border: "1px solid red",
          }}
        >
          {!!displayReport ? (
            <Box sx={{ height: 440, width: 800 }}>
              <Doughnut options={options} data={data} ref={ref} />
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

export default QueueManagementPage;
