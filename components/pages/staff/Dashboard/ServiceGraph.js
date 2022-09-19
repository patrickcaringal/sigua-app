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

const labels = ["Service1", "Service2", "Service3", "Service4", "Service5"];

export const data = {
  labels,
  datasets: [
    {
      label: "Services",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 100 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const ServiceGraph = () => {
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
      <Bar options={options} data={data} />
    </Paper>
  );
};

export default ServiceGraph;
