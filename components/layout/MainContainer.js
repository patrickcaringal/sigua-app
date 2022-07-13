import * as React from "react";

import { Box } from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const LeftSidebar = ({ children }) => {
  const { isAdminPanel } = useAuth();

  return (
    <Box
      component="main"
      sx={{
        ml: isAdminPanel ? "240px" : 0,
        bgcolor: "grey.100",
      }}
    >
      {children}
    </Box>
  );
};
export default LeftSidebar;
