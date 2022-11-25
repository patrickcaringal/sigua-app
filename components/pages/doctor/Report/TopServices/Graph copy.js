import React, { useRef } from "react";

import { Box, Button } from "@mui/material";
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
import { jsPDF } from "jspdf";
import { Bar } from "react-chartjs-2";

const customCanvasBackgroundColor = {
  id: "customCanvasBackgroundColor",
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = options.color || "#99ffff";
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
  customCanvasBackgroundColor
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
    customCanvasBackgroundColor: {
      color: "#fff",
    },
  },
  // plugins: [plugin],
  // backgroundColor: "blue",
  // color: "orange",
  // borderColor: "orange",
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const GraphComp = () => {
  const ref = useRef(null);

  const handleExport = () => {
    // { orientation: "landscape" }
    const doc = new jsPDF();

    doc.addImage(ref.current.canvas, null, 10, 10, 190, 80);

    doc.output("pdfobjectnewwindow");
  };

  return (
    <>
      <Button size="small" onClick={handleExport}>
        export
      </Button>
      <Box sx={{ height: 500 }}>
        <Bar options={options} data={data} ref={ref} />
      </Box>
    </>
  );
};

export default GraphComp;
