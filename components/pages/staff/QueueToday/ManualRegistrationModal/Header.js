import React, { useEffect, useState } from "react";

import { Box, Button, Container, Typography } from "@mui/material";

import { formatTimeStamp } from "../../../../../modules/helper";

const TodayHeader = ({ date, branch }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ fontWeight: "bold" }}
      >
        {branch}
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ fontWeight: "semibold" }}
      >
        {formatTimeStamp(date, "MMM dd, yyyy (eee)")}
      </Typography>
    </Box>
  );
};

export default TodayHeader;
