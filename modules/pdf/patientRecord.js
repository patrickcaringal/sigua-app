import faker from "faker";
import { jsPDF } from "jspdf";

import { formatTimeStamp } from "../helper";

export const exportPatientRecords = (m, p) => {
  let doc = new jsPDF();
  doc.setFontSize(10);

  const docHeight = doc.internal.pageSize.getHeight();

  const baseX = 8;
  const baseY = 10;
  let movingY = baseY;
  let movingYR = baseY;

  m.forEach((i, idx) => {
    doc.text(formatTimeStamp(i.date, "MMM-dd-yyyy eeee"), baseX, movingY);

    movingY += 5;
    // doc.text("Date:", baseX, movingY);
    doc.text(p.name, baseX, movingY);

    movingY += 5;
    doc.text("Branch:", baseX, movingY);
    doc.text(i.branchName, baseX + 14, movingY);

    movingY += 5;
    doc.text("Service:", baseX, movingY);
    doc.text(i.serviceName, baseX + 15, movingY);

    movingY += 5;
    doc.text("Doctor:", baseX, movingY);
    doc.text(i.doctorName || "-", baseX + 14, movingY);

    // ri

    doc.text("Doctor Diagnosis:", baseX + 80, movingYR);
    movingYR += 5;
    const diagnosis = doc.splitTextToSize(i.diagnosis, 110); // faker.lorem.paragraph(5)
    doc.text(diagnosis, baseX + 80, movingYR);
    movingYR += 4 * diagnosis.length;

    // marker
    // doc.text("~ ~ ~ ~ ~", baseX, movingY + 10);
    // doc.text("~ ~ ~ ~ ~", baseX + 80, movingYR + 10);

    if (movingY >= movingYR) {
      movingY += 15;
      movingYR = movingY;
      // doc.text("~ ~ ~ ~ ~ ~ ~ ~ ~ ~", baseX, movingY);
    } else {
      movingYR += 15;
      movingY = movingYR;
      // doc.text("~ ~ ~ ~ ~ ~ ~ ~ ~ ~", baseX + 80, movingYR);
    }
    if (docHeight < movingY + 50) {
      // reset to new page
      doc.addPage();
      movingY = baseY;
      movingYR = baseY;
    }
  });

  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
