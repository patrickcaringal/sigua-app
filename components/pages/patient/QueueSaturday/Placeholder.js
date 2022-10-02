import React from "react";

import { Box, Typography } from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";

const Placeholder = ({ text = "" }) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px - 72px)",
        display: "flex",
        flexDirection: " column",
        alignItems: "center",
        pt: 6,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        color="text.secondary"
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        Queue is not yet available
      </Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: "semibold" }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default Placeholder;
