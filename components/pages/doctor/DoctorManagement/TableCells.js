import React from "react";

import { TableCell, Typography } from "@mui/material";

const TableCells = ({ data }) => {
  const { id, name, email, branch, address, branchName } = data;
  return (
    <>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>
        <Typography
          variant="caption"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "2",
            overflow: "hidden",
          }}
          component="div"
        >
          {address}
        </Typography>
      </TableCell>
      <TableCell>{branchName}</TableCell>
    </>
  );
};

export default TableCells;
