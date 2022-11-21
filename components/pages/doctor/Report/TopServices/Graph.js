import React, { useRef } from "react";

import { Box, Button } from "@mui/material";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import faker from "faker";
import { jsPDF } from "jspdf";
import { Doughnut } from "react-chartjs-2";

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

ChartJS.register(ArcElement, Tooltip, Legend, customCanvasBackgroundColor);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "left",
    },
    // title: {
    //   display: true,
    //   text: "Chart.js Bar Chart",
    // },
    customCanvasBackgroundColor: {
      color: "#fff",
    },
  },
};

export const data = {
  labels: [
    "Lorem ipsum dolor sit amet",
    "Blue",
    "Yellow",
    "Green",
    "Purple",
    "Orange",
  ],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
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
      borderWidth: 1,
    },
  ],
};

const GraphComp = ({ onExport }) => {
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
      <Box sx={{ height: 500, width: 800 }}>
        <Doughnut options={options} data={data} ref={ref} />
      </Box>
    </>
  );
};

export default GraphComp;
