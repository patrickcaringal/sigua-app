import React from "react";

import { TableCell } from "@mui/material";

import { LongTypography } from "../../../../components/common";

const TableCells = ({ data }) => {
  const { id, title, content } = data;

  return (
    <>
      <TableCell sx={{ width: 250 }}>{title}</TableCell>
      <TableCell>
        <LongTypography text={content} displayedLines={2} />
      </TableCell>
    </>
  );
};

export default TableCells;
