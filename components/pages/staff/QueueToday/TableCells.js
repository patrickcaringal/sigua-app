import React from "react";

import { Chip, TableCell } from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";

const TableCells = ({ data }) => {
  const { id, isToday, date, capacity, openForRegistration } = data;

  return (
    <>
      <TableCell>{formatTimeStamp(date, "MMM dd, yyyy (eee)")}</TableCell>
      <TableCell>{capacity}</TableCell>
      <TableCell align="center">
        {isToday && !openForRegistration && (
          <Chip label="Close" color="warning" size="small" />
        )}
        {isToday && openForRegistration && (
          <Chip label="Open" color="primary" size="small" />
        )}
        {!isToday && <Chip label="Done" color="success" size="small" />}
      </TableCell>
    </>
  );
};

export default TableCells;
