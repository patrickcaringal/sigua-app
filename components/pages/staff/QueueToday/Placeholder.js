import React from "react";

import QueueIcon from "@mui/icons-material/Queue";
import { Box, Typography } from "@mui/material";

const Placeholder = () => {
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
        sx={{ fontWeight: "semibold" }}
      >
        No Queue Today
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ fontWeight: "semibold" }}
      >
        Add now
      </Typography>
    </Box>
  );
};

export default Placeholder;
