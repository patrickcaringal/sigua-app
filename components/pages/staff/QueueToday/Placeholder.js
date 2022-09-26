import React from "react";

import QueueIcon from "@mui/icons-material/Queue";
import { Box, Typography } from "@mui/material";

const Placeholder = ({ branch }) => {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: " column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography color="text.secondary" gutterBottom>
        <QueueIcon fontSize="large" />
      </Typography>

      <Typography
        variant="h4"
        gutterBottom
        color="text.secondary"
        sx={{ fontWeight: "bold" }}
      >
        No Queue Today
      </Typography>
      {branch && (
        <Typography
          variant="h5"
          gutterBottom
          color="text.secondary"
          sx={{ fontWeight: "semibold" }}
        >
          {branch} Branch
        </Typography>
      )}
    </Box>
  );
};

export default Placeholder;
