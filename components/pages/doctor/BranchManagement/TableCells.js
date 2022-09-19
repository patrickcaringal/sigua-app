import React from "react";

import { Box, Chip, TableCell, Typography } from "@mui/material";

import { LongTypography } from "../../../../components/common";

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
      <TableCell align="center">{capacity}</TableCell>

      <TableCell>
        <LongTypography text={address} displayedLines={1} />
      </TableCell>
    </>
  );
};

export default TableCells;
