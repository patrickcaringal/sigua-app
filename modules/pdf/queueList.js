import faker from "faker";
import { jsPDF } from "jspdf";
import lodash from "lodash";

import { formatTimeStamp } from "../helper";

export const exportQueueList = (q) => {
  const data = q;

  let doc = new jsPDF();
  const baseX = 8;
  const baseY = 10;
  let movingY = baseY;
  let movingYR = baseY;

  data.forEach((i, idx) => {
    movingY = baseY;
    doc.setFontSize(10);

    // header
    doc.text("Date:", baseX, movingY);
    doc.text(formatTimeStamp(i.date, "MMM-dd-yyyy eeee"), baseX + 10, 10);

    movingY += 5;
    doc.text("Branch:", baseX, movingY);
    doc.text(i.branchName, baseX + 14, movingY);

    movingY += 5;
    const registered = i.nextQueueNo - 1;
    doc.text("Patients: ", baseX, movingY);
    doc.text(`${registered} / ${i.capacity}`, baseX + 16, movingY);

    doc.text("Doctors:", baseX + 60, 10);
    let y = 5;
    lodash
      .values(i.counters)
      .map((i) => i.name)
      .forEach((j) => {
        y += 5;
        doc.text(j || "-", baseX + 60 + 16, y);
      });

    movingY += 10;
    // Patient list
    doc.text(`Served Patients (${i.done.length})`, baseX, movingY);
    i.done.forEach((j, idx) => {
      movingY += 5;
      doc.text(`${idx + 1}. ${j.patientName}`, baseX, movingY);
      doc.text(j.serviceName, baseX + 80, movingY);
    });

    movingY += 15;
    doc.text(`No Show Patients (${i.skipped.length})`, baseX, movingY);
    i.skipped.forEach((j, idx) => {
      movingY += 5;
      doc.text(`${idx + 1}. ${j.patientName}`, baseX, movingY);
      doc.text(j.serviceName, baseX + 80, movingY);
    });

    // if not last, add page
    if (idx + 1 !== data.length) doc.addPage();

    // add next page if text overlaps
  });

  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
