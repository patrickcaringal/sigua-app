import React from "react";

import { TableCell, Typography } from "@mui/material";

const TableCells = ({ data }) => {
  const { id, name, description } = data;

  return (
    <>
      <TableCell sx={{ width: 250 }}>{name}</TableCell>
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
          {description}
        </Typography>
      </TableCell>
    </>
  );
};

export default TableCells;
