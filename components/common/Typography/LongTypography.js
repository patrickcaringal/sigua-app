import React from "react";

import { Typography } from "@mui/material";

const LongTypography = ({
  text,
  variant = "caption",
  displayedLines = 0,
  maxWidth = "none",
  color = "text.primary",
}) => {
  return (
    <Typography
      variant={variant}
      sx={
        displayedLines !== 0 && {
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: `${displayedLines}`,
          overflow: "hidden",
          maxWidth,
        }
      }
      component="div"
      color={color}
    >
      {text}
    </Typography>
  );
};

export default LongTypography;
