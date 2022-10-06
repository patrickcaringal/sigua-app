import faker from "faker";
import { jsPDF } from "jspdf";
import lodash from "lodash";

import { formatTimeStamp } from "../helper";

export const exportQueueList = (q) => {
  const data = q;

  let doc = new jsPDF();
  const baseX = 8;

  data.forEach((i, idx) => {
    doc.setFontSize(10);

    // header
    doc.text("Date:", baseX, 10);
    doc.text(formatTimeStamp(i.date, "MMM-dd-yyyy eeee"), baseX + 10, 10);

    doc.text("Branch:", baseX, 15);
    doc.text(i.branchName, baseX + 14, 15);

    const registered = i.nextQueueNo - 1;
    doc.text("Patients: ", baseX, 20);
    doc.text(`${registered} / ${i.capacity}`, baseX + 16, 20);

    doc.text("Doctors:", baseX + 60, 10);
    let y = 5;
    lodash
      .values(i.counters)
      .map((i) => i.name)
      .forEach((j) => {
        y += 5;
        doc.text(j || "-", baseX + 60 + 16, y);
      });

    // Patient list
    doc.text(`Served Patients (${i.done.length})`, baseX, 30);
    y = 32;
    i.done.forEach((j, idx) => {
      y += 5;
      doc.text(`${idx + 1}. ${j.patientName} - ${j.serviceName}`, baseX, y);
    });
    // [...Array(80).keys()].forEach((j, idx) => {
    //   y += 5;
    //   doc.text(`${idx + 1}. ${faker.name.findName()}`, baseX, y);
    // });

    doc.text(`No Show Patients (${i.skipped.length})`, baseX + 100, 30);
    y = 32;
    i.skipped.forEach((j, idx) => {
      y += 5;
      doc.text(
        `${idx + 1}. ${j.patientName} - ${j.serviceName}`,
        baseX + 100,
        y
      );
    });

    // if not last, add page
    if (idx + 1 !== data.length) doc.addPage();
  });

  doc.output("pdfobjectnewwindow"); //opens the data uri in new window
};
