import * as React from "react";

import { Box } from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const LeftSidebar = ({ children }) => {
  const { isAdmin } = useAuth();

  return (
    <Box component="main" sx={{ ml: isAdmin ? "240px" : 0 }}>
      {children}
    </Box>
  );
};
export default LeftSidebar;
