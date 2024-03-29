import React from "react";

import { Box } from "@mui/material";

const Datalist = ({ data, labelWidth = 100 }) => (
  <Box
    sx={{
      display: "grid",
      grid: "auto-flow / 0fr 1fr",
      alignItems: "center",
      rowGap: 1,
    }}
  >
    {data.map(({ label, value }, index) => (
      <React.Fragment key={index}>
        <Box sx={{ minWidth: labelWidth, alignSelf: "flex-start" }}>
          {label}
        </Box>
        <Box sx={{ fontWeight: 500 }}>{value}</Box>
      </React.Fragment>
    ))}
  </Box>
);

export default Datalist;
