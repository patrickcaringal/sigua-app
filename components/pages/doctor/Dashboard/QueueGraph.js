import React from "react";

import { Paper } from "@mui/material";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import faker from "faker";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
    y: {
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
        height: "calc(100vh - 228px - 64px - 64px )",
        px: 4,
        py: 3,
        flex: 2,
      }}
      elevation={2}
    >
      <Line options={options} data={graphData} />
    </Paper>
  );
};

export default QueueGraph;
