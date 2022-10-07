import React from "react";

import { TableContainer } from "@mui/material";

const TableContainerComponent = ({ children }) => {
  return (
    <TableContainer
      sx={{
        maxHeight: "calc(100vh - 64px - 64px - 16px - 77px)",
        overflow: "overlay",
      }}
    >
      {children}
    </TableContainer>
  );
};

export default TableContainerComponent;
