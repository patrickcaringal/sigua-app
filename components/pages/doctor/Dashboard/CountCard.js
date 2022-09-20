import React from "react";

import { Box, Card, CardContent, Typography } from "@mui/material";

const CountCard = ({ count = 0, label = "-", icon }) => (
  <Card sx={{ width: 371, height: 150 }}>
    <CardContent
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "inherit",
        height: "inherit",
        gap: 3,
      }}
    >
      {/* <AssignmentIndIcon sx={{ fontSize: 90, color: "text.secondary" }} /> */}
      {icon}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h3" fontWeight={500} color="text.secondary">
          {count}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

export default CountCard;
