import React from "react";

import { Box, Paper } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import faker from "faker";
import lodash from "lodash";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  scales: {
    x: {
      ticks: {
        stepSize: 1,
        beginAtZero: true,
      },
    },
  },
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    // legend: {
    //   position: "right",
    // },
    // title: {
    //   display: true,
    //   text: "Chart.js Horizontal Bar Chart",
    // },
  },
  maintainAspectRatio: false,
};

const ServiceGraph = ({ data }) => {
  const graphData = {
    labels: lodash.keys(data),
    datasets: [
      {
        label: "Services",
        data: lodash.values(data),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <Paper
      sx={{
        mt: 4,
        // border: "1px solid red",
        height: "calc(100vh - 228px - 64px - 64px )",
        px: 4,
        py: 3,
        flex: 1,
      }}
      elevation={2}
    >
      <Bar options={options} data={graphData} />
    </Paper>
  );
};

export default ServiceGraph;
