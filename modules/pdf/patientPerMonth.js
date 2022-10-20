import faker from "faker";
import { jsPDF } from "jspdf";
import lodash from "lodash";

import { formatTimeStamp } from "../helper";

export const exportPatientPerMonth = ({
  start,
  months,
  tData,
  bData,
  branches,
}) => {
  const generateTbody = () => {
    const x = months.map((i, idx) => {
      const month = formatTimeStamp(i, "MMMM");
      const v = lodash.values(tData[month]);
      const sum = lodash.sum(v);

      let result = {
        month,
        total: `${sum}`,
      };

      branches.forEach((j) => {
        result[j.id] = tData[month][j.id] ? `${tData[month][j.id]}` : "-";
      });

      return result;
    });
    let footer = { month: "TOTAL", total: `${bData.total}` };
    branches.forEach((j) => {
      const key = j.id;
      footer[key] = bData[key] ? `${bData[key]}` : "-";
    });
    x.push(footer);

    return x;
  };

  const thead = [
    {
      name: "month",
      prompt: formatTimeStamp(start, "yyyy"),
    },
    ...branches.map((j) => ({ name: j.id, prompt: j.name, align: "right" })),
    {
      name: "total",
      prompt: "TOTAL",
      align: "right",
    },
  ];

  var doc = new jsPDF();
  const baseX = 8;
  const baseY = 10;
  let movingY = baseY;

  const config = {
    autoSize: true,
    fontSize: 10,
    headerBackgroundColor: "#009FFE",
  };

  doc.setFont(undefined, "bold");
  doc.setFontSize(16);

  doc.text(
    `${formatTimeStamp(start, "yyyy")} Number of Patients Per Month`,
    baseX,
    movingY
  );
  movingY += 10;
  doc.setFont(undefined, "normal");

  doc.table(baseX, movingY, generateTbody(), thead, config);
  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
