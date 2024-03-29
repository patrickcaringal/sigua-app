import React, { useEffect, useState } from "react";

import HomeIcon from "@mui/icons-material/Home";
import { Box, Breadcrumbs, Link, Toolbar, Typography } from "@mui/material";

const ToolbarComponent = ({ children, onRootClick, paths = [] }) => {
  const handleRootClick = (e) => {
    e.preventDefault();
    onRootClick();
  };

  return (
    <Toolbar
      disableGutters
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          width: { xs: "100%", md: "unset" },
          my: { xs: 2, md: 0 },
        }}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            href="#"
            underline="hover"
            color="inherit"
            onClick={handleRootClick}
          >
            <HomeIcon sx={{ mt: "4px" }} />
          </Link>

          {paths.map(({ text, onClick }, index) => (
            <Typography
              key={index}
              {...(!!onClick && {
                onClick,
                sx: { cursor: "pointer" },
              })}
            >
              {text}
            </Typography>
          ))}
        </Breadcrumbs>
      </Box>
      {children}
    </Toolbar>
  );
};

export default ToolbarComponent;
