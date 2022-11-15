import React from "react";

import { TableCell, Typography } from "@mui/material";

import { LongTypography } from "../../../../components/common";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";

const TableCells = ({ data }) => {
  const {
    id,
    name,
    birthdate,
    email,
    branch,
    gender,
    address,
    branchName,
    specialty,
  } = data;
  return (
    <>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{specialty || "-"}</TableCell>
      <TableCell align="center">
        {calculateAge(formatTimeStamp(birthdate))}
      </TableCell>
      <TableCell sx={{ textTransform: "capitalize" }}>{gender}</TableCell>
      {/* <TableCell>{contactNo}</TableCell> */}
      <TableCell>
        <LongTypography text={address} displayedLines={1} />
      </TableCell>
    </>
  );
};

export default TableCells;
