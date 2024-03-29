import React from "react";

import { Chip, TableCell } from "@mui/material";
import lodash from "lodash";

import { formatTimeStamp } from "../../../../modules/helper";

const TableCells = ({ data }) => {
  const {
    id,
    isToday,
    date,
    capacity,
    counters,
    queue = [],
    next = [],
    done = [],
    skipped = [],
    openForRegistration,
    nextQueueNo,
  } = data;
  const doctors = lodash.values(counters).map((i) => i.name);
  // const registered = queue.length + next.length + skipped.length + done.length;
  // const registered = nextQueueNo - 1;
  const registered = done?.length + skipped?.length;

  return (
    <>
      <TableCell>{formatTimeStamp(date, "MMM-dd-yyyy")}</TableCell>
      <TableCell>{formatTimeStamp(date, "eeee")}</TableCell>
      <TableCell>{doctors.join(", ")}</TableCell>
      <TableCell align="right">{capacity}</TableCell>
      <TableCell align="right">{registered}</TableCell>
      <TableCell align="right">{done.length}</TableCell>
      <TableCell align="right">{skipped.length}</TableCell>
      {/* <TableCell align="center">
        {isToday && !openForRegistration && (
          <Chip label="Close" color="warning" size="small" />
        )}
        {isToday && openForRegistration && (
          <Chip label="Open" color="primary" size="small" />
        )}
        {!isToday && <Chip label="Done" color="success" size="small" />}
      </TableCell> */}
    </>
  );
};

export default TableCells;
