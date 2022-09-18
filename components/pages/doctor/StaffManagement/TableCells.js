import React from "react";

import { TableCell, Typography } from "@mui/material";

import { LongTypography } from "../../../../components/common";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";

const TableCells = ({ data }) => {
  const { id, name, birthdate, gender, email, branch, address, branchName } =
    data;
  return (
    <>
      <TableCell>{name}</TableCell>
      <TableCell>{formatTimeStamp(birthdate, "MMM-dd-yyyy")}</TableCell>
      <TableCell align="center">
        {calculateAge(formatTimeStamp(birthdate))}
      </TableCell>
      <TableCell sx={{ textTransform: "capitalize" }}>{gender}</TableCell>
      <TableCell>
        <LongTypography text={address} displayedLines={1} />
      </TableCell>
      <TableCell>{branchName}</TableCell>
    </>
  );
};

export default TableCells;
