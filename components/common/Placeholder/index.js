import React from "react";

import { Box, Typography } from "@mui/material";

const Placeholder = ({
  text = "No data found",
  children = null,
  display = true,
}) => {
  if (!display) return null;

  return (
    <Box
      sx={{
        // border: "1px solid blue",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "calc(100vh / 3)",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        {children}
        {!children && text && (
          <Typography variant="h6" color="text.secondary">
            {text}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Placeholder;
