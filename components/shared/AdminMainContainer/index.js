import React, { useState } from "react";

import { Box, Paper } from "@mui/material";

import { Toolbar } from "../../common";

const AdminMainContainer = ({ children, toolbarProps, toolbarContent }) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        mx: 4,
      }}
    >
      <Toolbar {...toolbarProps}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
          }}
        >
          {toolbarContent}
        </Box>
      </Toolbar>
      <Box>
        <Paper
          elevation={2}
          sx={{
            height: "calc(100vh - 64px - 64px - 16px)",
            // overflow: "overlay",
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminMainContainer;
