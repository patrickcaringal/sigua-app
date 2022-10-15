import React from "react";

import { TableContainer } from "@mui/material";

const TableContainerComponent = ({
  children,
  maxHeight = "calc(100vh - 64px - 64px - 16px - 77px)",
}) => {
  return (
    <TableContainer
      sx={{
        maxHeight: maxHeight,
        overflow: "overlay",
      }}
    >
      {children}
    </TableContainer>
  );
};

export default TableContainerComponent;
