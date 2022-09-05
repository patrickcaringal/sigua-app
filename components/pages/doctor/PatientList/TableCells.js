import React from "react";

import { TableCell } from "@mui/material";

import { LongTypography } from "../../../../components/common";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";

const TableCells = ({ data }) => {
  const { name, gender, birthdate, contactNo, address } = data;

  return (
    <>
      <TableCell>{name}</TableCell>
      <TableCell>{formatTimeStamp(birthdate, "MMM-dd-yyyy")}</TableCell>
      <TableCell align="center">
        {calculateAge(formatTimeStamp(birthdate))}
      </TableCell>
      <TableCell sx={{ textTransform: "capitalize" }}>{gender}</TableCell>
      <TableCell>{contactNo}</TableCell>
      <TableCell sx={{ maxWidth: 300, height: 53 }}>
        <LongTypography text={address} />
      </TableCell>
    </>
  );
};

export default TableCells;
