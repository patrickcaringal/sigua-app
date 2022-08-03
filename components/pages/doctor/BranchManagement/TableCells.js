import React from "react";

import { Box, Chip, TableCell, Typography } from "@mui/material";

const TableCells = ({ data }) => {
  const { id, name, address, capacity, services } = data;

  return (
    <>
      <TableCell>{name}</TableCell>
      <TableCell>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {services.map((s, index) => (
            <Chip key={index} label={s} color="primary" size="small" />
          ))}
        </Box>
      </TableCell>
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
      <TableCell align="center">{capacity}</TableCell>
    </>
  );
};

export default TableCells;