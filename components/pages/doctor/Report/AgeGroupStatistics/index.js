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
import {
  eachMonthOfInterval,
  eachYearOfInterval,
  endOfYear,
  startOfYear,
} from "date-fns";
import { jsPDF } from "jspdf";
import _ from "lodash";
import { useRouter } from "next/router";
import { Bar } from "react-chartjs-2";

import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../../hooks";
import {
  getAllPatientsReq,
  getAllRecordsReq,
  getBranchesReq,
  getServicesReq,
} from "../../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../../modules/helper";
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
  plugins: {
    legend: {
      position: "top",
    },
    ...chartplugin,
  },
  scales: {
    y: {
      ticks: {
        beginAtZero: true,
      },
    },
  },
};

const AgeStatisticsPage = () => {
  const ref = useRef(null);
  const router = useRouter();

  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getAllRecords] = useRequest(getAllRecordsReq, setBackdropLoader);
  // const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [getPatients] = useRequest(getAllPatientsReq, setBackdropLoader);

  // Local States
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [ageGroup, setAgeGroup] = useState([]);
  // const [services, setServices] = useState([]);
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

    const fetchPatients = async () => {
      const { data, error } = await getPatients();
      if (error) return openErrorDialog(error);

      const kid = data
        .filter((i) =>
          _.inRange(calculateAge(formatTimeStamp(i.birthdate)), 1, 10)
        )
        .map((i) => i.id);

      const teenanger = data
        .filter((i) =>
          _.inRange(calculateAge(formatTimeStamp(i.birthdate)), 11, 18)
        )
        .map((i) => i.id);

      const adult = data
        .filter((i) =>
          _.inRange(calculateAge(formatTimeStamp(i.birthdate)), 11, 100)
        )
        .map((i) => i.id);

      setAgeGroup({ kid, teenanger, adult });
    };

    const fetchBranches = async () => {
      const { data, error } = await getBranches({ mapService: false });
      if (error) return openErrorDialog(error);

      setBranches(data);
    };

    fetchMedicalRecords();
    fetchPatients();
    // fetchServices();
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
    if (!displayReport) return;

    let x = {};

    if (filtering.filters.rangeDisplay === "permonth") {
      const months = eachMonthOfInterval({
        start: startOfYear(new Date(filtering.filters.endDate)),
        end: endOfYear(new Date(filtering.filters.endDate)),
      });

      // init data
      months.forEach((m) => {
        x[formatTimeStamp(m, "MMMM yyyy")] = { kid: 0, teenanger: 0, adult: 0 };
      });

      // populate data
      months.forEach((m) => {
        const perMonthVisit = filtering.filtered.filter(
          (i) => formatTimeStamp(i.date, "MMM") === formatTimeStamp(m, "MMM")
        );

        perMonthVisit.forEach((i) => {
          if (ageGroup.kid.includes(i.patientId)) {
            x[formatTimeStamp(m, "MMMM yyyy")].kid += 1;
          } else if (ageGroup.teenanger.includes(i.patientId)) {
            x[formatTimeStamp(m, "MMMM yyyy")].teenanger += 1;
          } else {
            x[formatTimeStamp(m, "MMMM yyyy")].adult += 1;
          }
        });
      });
    }

    if (filtering.filters.rangeDisplay === "peryear") {
      const years = eachYearOfInterval({
        start: startOfYear(new Date(filtering.filters.startDate)),
        end: endOfYear(new Date(filtering.filters.endDate)),
      });

      // init data
      years.forEach((y) => {
        x[formatTimeStamp(y, "yyyy")] = { kid: 0, teenanger: 0, adult: 0 };
      });

      // populate data
      years.forEach((y) => {
        const perYearVisit = filtering.filtered.filter(
          (i) => formatTimeStamp(i.date, "yyyy") === formatTimeStamp(y, "yyyy")
        );

        perYearVisit.forEach((i) => {
          if (ageGroup.kid.includes(i.patientId)) {
            x[formatTimeStamp(y, "yyyy")].kid += 1;
          } else if (ageGroup.teenanger.includes(i.patientId)) {
            x[formatTimeStamp(y, "yyyy")].teenanger += 1;
          } else {
            x[formatTimeStamp(y, "yyyy")].adult += 1;
          }
        });
      });
    }

    return x;
  };

  const reportData = generateReportData();

  const data = {
    labels: _.keys(reportData).map((i) =>
      formatTimeStamp(
        i,
        filtering.filters.rangeDisplay === "permonth" ? "MMMM" : "yyyy"
      )
    ),
    datasets: [
      {
        label: "Kid: 1 - 10 Years old",
        data: _.values(reportData).map((i) => i.kid),
        backgroundColor: "rgba(53, 162, 235, 0.7)",
      },
      {
        label: "Teenanger: 11 - 18 Years old",
        data: _.values(reportData).map((i) => i.teenanger),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },

      {
        label: "Adult: 19 Years old - Onwards",
        data: _.values(reportData).map((i) => i.adult),
        backgroundColor: "rgba(255, 206, 86, 0.7)",
      },
    ],
  };

  const handleExport = () => {
    const doc = new jsPDF({ orientation: "l" });

    doc.text(translateHeader(filtering.filters), 150, 15, null, null, "center");
    doc.addImage(ref.current.canvas, null, 10, 30, 280, 100);

    doc.output("pdfobjectnewwindow");
  };

  const translateHeader = ({ branch, rangeDisplay, startDate, endDate }) => {
    const b =
      branch !== "-"
        ? branches.find((i) => i.id === branch)?.name
        : "All Branches";

    let d =
      rangeDisplay === "permonth"
        ? `Per Month of ${formatTimeStamp(new Date(startDate), "yyyy")}`
        : rangeDisplay === "peryear"
        ? `Per Year`
        : "";

    return `Patient Age Group Visit ${d} ${b}`;
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Age Group Statistics" }],
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
          // alignItems: "center",
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 6, textAlign: "center" }}>
          {!!displayReport && translateHeader(filtering.filters)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {!!displayReport ? (
            <Box sx={{ height: 400, flex: 1 }}>
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

export default AgeStatisticsPage;
