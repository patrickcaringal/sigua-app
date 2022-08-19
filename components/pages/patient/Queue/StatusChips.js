import React from "react";

import { Box, Chip } from "@mui/material";

const StatusChips = ({ isRegOpen, isQueueOngoing }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      {isRegOpen ? (
        <Chip label="Registration Open" color="primary" size="large" />
      ) : (
        <Chip label="Registration Close" color="error" size="large" />
      )}
      {isQueueOngoing ? (
        <Chip label="Queue Ongoing" color="primary" size="large" />
      ) : (
        <Chip label="Queue Close" color="error" size="large" />
      )}
    </Box>
  );
};

export default StatusChips;
