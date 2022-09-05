import React from "react";

import { Typography } from "@mui/material";

const LongTypography = ({ text, displayedLines = 1, maxWidth = "none" }) => {
  return (
    <Typography
      variant="caption"
      sx={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: `${displayedLines}`,
        overflow: "hidden",
        maxWidth,
      }}
      component="div"
    >
      {text}
    </Typography>
  );
};

export default LongTypography;
