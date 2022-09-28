import React from "react";

import { Paper, Typography } from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    // title: {
    //   display: true,
    //   text: "Queue last 7 days",
    // },
  },
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      ticks: {
        stepSize: 1,
        beginAtZero: true,
      },
    },
  },
};

const QueueGraph = ({ data }) => {
  const { labels, dataset1, dataset2 } = data;
  const graphData = {
    labels,
    datasets: [
      {
        label: "Served Patients",
        data: dataset1,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "No Show Patients",
        data: dataset2,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <Paper
      sx={{
        mt: 4,
        // border: "1px solid red",
        height: "calc(100vh - 228px - 64px)",
        px: 4,
        pt: 2,
        pb: 8,
        flex: 2,
      }}
      elevation={2}
    >
      <Typography variant="h6" fontWeight="semibold">
        Queue Last 7 days
      </Typography>
      <Bar options={options} data={graphData} />
    </Paper>
  );
};

export default QueueGraph;
