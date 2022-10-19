import { endOfWeek } from "date-fns";
import faker from "faker";
import { jsPDF } from "jspdf";
import lodash from "lodash";

import { formatTimeStamp } from "../helper";

export const exportPatientPerWeek = ({
  start,
  weeks,
  tData,
  bData,
  branches,
}) => {
  const generateKey = (d) => formatTimeStamp(d, "w");

  const generateTbody = () => {
    const x = weeks.map((i, idx) => {
      const week = generateKey(i);
      const v = lodash.values(tData[week]);
      const sum = lodash.sum(v);

      let result = {
        week: `${formatTimeStamp(i, "MMM dd")} - ${formatTimeStamp(
          endOfWeek(i),
          "MMM dd"
        )}`,
        total: `${sum}`,
      };

      branches.forEach((j) => {
        result[j.id] = tData[week][j.id] ? `${tData[week][j.id]}` : "-";
      });

      return result;
    });
    let footer = { week: "TOTAL", total: `${bData.total}` };
    branches.forEach((j) => {
      const key = j.id;
      footer[key] = bData[key] ? `${bData[key]}` : "-";
    });
    x.push(footer);

    return x;
  };

  const thead = [
    {
      name: "week",
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
    `${formatTimeStamp(start, "yyyy")} Number of Patients Per Week`,
    baseX,
    movingY
  );
  movingY += 10;
  doc.setFont(undefined, "normal");

  doc.table(baseX, movingY, generateTbody(), thead, config);
  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
