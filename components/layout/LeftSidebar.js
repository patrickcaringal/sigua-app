import * as React from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupIcon from "@mui/icons-material/Group";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const LeftSidebar = () => {
  const router = useRouter();

  const { isAdminPanel, isAdmin } = useAuth();

  if (!isAdminPanel) return null;

  const sidebarItems = isAdmin
    ? [
        {
          text: "Staffs",
          icon: <GroupIcon />,
          onClick: () => router.push("/doctor/staffs"),
        },
        {
          text: "Branches",
          icon: <LocalHospitalIcon />,
          onClick: () => router.push("/doctor/branches"),
        },
      ]
    : [
        {
          text: "Member Approval",
          icon: <FactCheckIcon />,
          onClick: () => router.push("/staff/member/approval"),
        },
      ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,

        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "common.white",
          border: "none",
          boxShadow: "0px 1px 8px 0px rgb(0, 0, 0, 0.01)",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {sidebarItems.map(({ text, icon, onClick }) => (
            <ListItem key={text} disablePadding onClick={onClick}>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* 
        <Divider />
        <List>
          {["Doctors", "Staffs", "Branches", "Services"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Reports"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Box>
    </Drawer>
  );
};
export default LeftSidebar;
