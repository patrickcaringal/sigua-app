import * as React from "react";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GroupIcon from "@mui/icons-material/Group";
import ListIcon from "@mui/icons-material/List";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleIcon from "@mui/icons-material/People";
import QueueIcon from "@mui/icons-material/Queue";
import ViewListIcon from "@mui/icons-material/ViewList";
import WarehouseIcon from "@mui/icons-material/Warehouse";
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

import { PATHS } from "../../components/common/Routes";
import { useAuth } from "../../contexts/AuthContext";

const drawerWidth = 240;

const LeftSidebar = () => {
  const router = useRouter();

  const { isLoggedIn, isAdminPanel, isAdmin, isDoctor } = useAuth();

  if (!isLoggedIn || !isAdminPanel) return null;

  const sidebarItems = isAdmin
    ? [
        {
          text: "Patient Records",
          icon: <PeopleIcon />,
          onClick: () => router.push(PATHS.DOCTOR.PATIENTS_LIST),
        },
        {
          text: "Patient Approval",
          icon: <FactCheckIcon />,
          onClick: () => router.push(PATHS.DOCTOR.PATIENTS_APPROVAL),
        },
        { text: "Divider" },
        {
          text: "Diagnose Patient",
          icon: <MedicalInformationIcon />,
          onClick: () => router.push(PATHS.DOCTOR.DIAGNOSE),
        },
        { text: "Divider" },
        {
          text: "Doctors",
          icon: <AssignmentIndIcon />,
          onClick: () => router.push(PATHS.DOCTOR.DOCTOR_MANAGEMENT),
        },
        {
          text: "Staffs",
          icon: <AssignmentIndIcon />,
          onClick: () => router.push(PATHS.DOCTOR.STAFF_MANAGEMENT),
        },
        {
          text: "Branches",
          icon: <MapsHomeWorkIcon />,
          onClick: () => router.push(PATHS.DOCTOR.BRANCH_MANAGEMENT),
        },
        {
          text: "Services",
          icon: <MedicalServicesIcon />,
          onClick: () => router.push(PATHS.DOCTOR.SERVICES_MANAGEMENT),
        },
      ]
    : isDoctor
    ? [
        {
          text: "Patient Records",
          icon: <PeopleIcon />,
          onClick: () => router.push(PATHS.DOCTOR.PATIENTS_LIST),
        },
        {
          text: "Diagnose Patient",
          icon: <MedicalInformationIcon />,
          onClick: () => router.push(PATHS.DOCTOR.DIAGNOSE),
        },
      ]
    : [
        // {
        //   text: "Queue",
        //   icon: <QueueIcon />,
        //   onClick: () => router.push(PATHS.STAFF.QUEUE_MANAGEMENT),
        // },
        {
          text: "Patient Records",
          icon: <PeopleIcon />,
          onClick: () => router.push(PATHS.STAFF.PATIENTS_LIST),
        },
        {
          text: "Patient Approval",
          icon: <FactCheckIcon />,
          onClick: () => router.push(PATHS.STAFF.MEMBER_APPROVAL),
        },
        {
          text: "Queue Today",
          icon: <QueueIcon />,
          onClick: () => router.push(PATHS.STAFF.QUEUE_TODAY),
        },
        {
          text: "Queues",
          icon: <ViewListIcon />,
          onClick: () => router.push(PATHS.STAFF.QUEUE_MANAGEMENT),
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
          {sidebarItems.map(({ text, icon, onClick }, index) => {
            if (text === "Divider")
              return <Divider key={index} sx={{ my: 1 }} />;

            return (
              <ListItem key={text} disablePadding onClick={onClick}>
                <ListItemButton>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            );
          })}
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
