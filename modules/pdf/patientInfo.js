import faker from "faker";
import { jsPDF } from "jspdf";
import _ from "lodash";

import { formatTimeStamp } from "../helper";

export const exportPatientInfo = (p) => {
  const doc = new jsPDF({ orientation: "l" });

  doc.setFontSize(10);

  const docHeight = doc.internal.pageSize.getHeight();

  const baseX = 0;
  const baseY = 0;
  let movingY = baseY;
  let movingYR = baseY;

  const config = {
    autoSize: true,
    fontSize: 10,
    headerBackgroundColor: "#009FFE",
  };

  const thead = [
    {
      name: "name",
      prompt: "Name",
    },
    {
      name: "birthdate",
      prompt: "Birthdate",
    },
    {
      name: "gender",
      prompt: "Gender",
    },
    {
      name: "contactNo",
      prompt: "Contact No",
    },
    {
      name: "address",
      prompt: "Address",
    },
  ];

  const tbody = p.map((i) => ({
    ..._.pick(i, ["name", "birthdate", "gender", "contactNo", "address"]),
    birthdate: formatTimeStamp(i.birthdate, "MMM-dd-yyyy"),
    contactNo: i.contactNo || "-",
  }));

  doc.table(baseX, movingY, tbody, thead, config);
  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
