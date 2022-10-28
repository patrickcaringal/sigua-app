import React from "react";

import { Box, Paper, Typography } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import faker from "faker";
import lodash from "lodash";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const options = {
  scales: {},
  responsive: true,
  plugins: {},
  maintainAspectRatio: false,
};

const ServiceGraph = ({ data }) => {
  const graphData = {
    labels: lodash.keys(data),
    datasets: [
      {
        label: "Services",
        data: lodash.values(data),
        // borderColor: "rgb(53, 162, 235)",
        // backgroundColor: "rgba(53, 162, 235, 0.5)",
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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
        Services
      </Typography>
      {/* <Bar options={options} data={graphData} /> */}
      <Pie options={options} data={graphData} />
    </Paper>
  );
};

export default ServiceGraph;
