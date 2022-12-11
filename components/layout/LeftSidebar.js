import * as React from "react";

import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddToQueueIcon from "@mui/icons-material/AddToQueue";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import CampaignIcon from "@mui/icons-material/Campaign";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import FeedbackIcon from "@mui/icons-material/Feedback";
import GroupIcon from "@mui/icons-material/Group";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import ListIcon from "@mui/icons-material/List";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import PeopleIcon from "@mui/icons-material/People";
import QueueIcon from "@mui/icons-material/Queue";
import ViewListIcon from "@mui/icons-material/ViewList";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
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

  // console.log();

  const sidebarItems = isAdmin
    ? [
        {
          text: "Patient Records",
          icon: <PeopleIcon />,
          onClick: () => router.push(PATHS.DOCTOR.PATIENTS_LIST),
          id: [
            PATHS.DOCTOR.PATIENTS_LIST,
            PATHS.DOCTOR.PATIENTS_MEDICAL_RECORD,
          ],
        },
        {
          text: "Patient Approval",
          icon: <FactCheckIcon />,
          onClick: () => router.push(PATHS.DOCTOR.PATIENTS_APPROVAL),
          id: [PATHS.DOCTOR.PATIENTS_APPROVAL],
        },
        {
          text: "Patient Accounts",
          icon: <AccountBoxIcon />,
          onClick: () => router.push(PATHS.DOCTOR.PATIENT_ACCOUNTS),
          id: [PATHS.DOCTOR.PATIENT_ACCOUNTS],
        },
        { text: "Divider" },
        {
          text: "Diagnose Patient",
          icon: <MedicalInformationIcon />,
          onClick: () => router.push(PATHS.DOCTOR.DIAGNOSE),
          id: [PATHS.DOCTOR.DIAGNOSE],
        },
        {
          text: "Queue Today",
          icon: <QueueIcon />,
          onClick: () => router.push(PATHS.DOCTOR.QUEUE_TODAY),
          id: [PATHS.DOCTOR.QUEUE_TODAY],
        },
        {
          text: "Sunday Queue",
          icon: <QueueIcon />,
          onClick: () => router.push(PATHS.DOCTOR.QUEUE_SUNDAY),
          id: [PATHS.DOCTOR.QUEUE_SUNDAY],
        },

        { text: "Divider" },
        {
          text: "Doctors",
          icon: <AssignmentIndIcon />,
          onClick: () => router.push(PATHS.DOCTOR.DOCTOR_MANAGEMENT),
          id: [PATHS.DOCTOR.DOCTOR_MANAGEMENT, PATHS.DOCTOR.DOCTOR_RESTORE],
        },
        {
          text: "Staffs",
          icon: <AssignmentIndIcon />,
          onClick: () => router.push(PATHS.DOCTOR.STAFF_MANAGEMENT),
          id: [PATHS.DOCTOR.STAFF_MANAGEMENT, PATHS.DOCTOR.STAFF_RESTORE],
        },
        {
          text: "Branches",
          icon: <MapsHomeWorkIcon />,
          onClick: () => router.push(PATHS.DOCTOR.BRANCH_MANAGEMENT),
          id: [PATHS.DOCTOR.BRANCH_MANAGEMENT, PATHS.DOCTOR.BRANCH_RESTORE],
        },
        {
          text: "Services",
          icon: <MedicalServicesIcon />,
          onClick: () => router.push(PATHS.DOCTOR.SERVICES_MANAGEMENT),
          id: [PATHS.DOCTOR.SERVICES_MANAGEMENT, PATHS.DOCTOR.SERVICES_RESTORE],
        },
        // {
        //   text: "Queues",
        //   icon: <ViewListIcon />,
        //   onClick: () => router.push(PATHS.DOCTOR.QUEUE_MANAGEMENT),
        // },
        {
          text: "Announcements",
          icon: <CampaignIcon />,
          onClick: () => router.push(PATHS.DOCTOR.ANNOUNCEMENT_MANAGEMENT),
          id: [
            PATHS.DOCTOR.ANNOUNCEMENT_MANAGEMENT,
            PATHS.DOCTOR.ANNOUNCEMENT_RESTORE,
          ],
        },
        {
          text: "Feedback approval",
          icon: <FeedbackIcon />,
          onClick: () => router.push(PATHS.DOCTOR.FEEDBACK_APPROVAL),
          id: [PATHS.DOCTOR.FEEDBACK_APPROVAL],
        },
        { text: "Divider" },
        // { text: "subheader", title: "Reports" },
        {
          text: "Queue Per Day",
          icon: <InsertChartIcon />,
          onClick: () => router.push(PATHS.DOCTOR.REPORT_QUEUE),
          id: [PATHS.DOCTOR.REPORT_QUEUE],
        },
        {
          text: "Patients YTD",
          icon: <InsertChartIcon />,
          onClick: () => router.push(PATHS.DOCTOR.REPORT_TRANSACTION),
          id: [PATHS.DOCTOR.REPORT_TRANSACTION],
        },
        {
          text: "Top Services",
          icon: <InsertChartIcon />,
          onClick: () => router.push(PATHS.DOCTOR.REPORT_TOP_SERVICES),
          id: [PATHS.DOCTOR.REPORT_TOP_SERVICES],
        },
        {
          text: "Top Branches",
          icon: <InsertChartIcon />,
          onClick: () => router.push(PATHS.DOCTOR.REPORT_TOP_BRANCHES),
          id: [PATHS.DOCTOR.REPORT_TOP_BRANCHES],
        },
        {
          text: "Gender Statistics",
          icon: <InsertChartIcon />,
          onClick: () => router.push(PATHS.DOCTOR.REPORT_TOP_GENDER_STATISTICS),
          id: [PATHS.DOCTOR.REPORT_TOP_GENDER_STATISTICS],
        },
        {
          text: "Age Statistics",
          icon: <InsertChartIcon />,
          onClick: () =>
            router.push(PATHS.DOCTOR.REPORT_TOP_AGE_GROUP_STATISTICS),
          id: [PATHS.DOCTOR.REPORT_TOP_AGE_GROUP_STATISTICS],
        },
        {
          text: "Activity Logs",
          icon: <InsertChartIcon />,
          onClick: () => router.push(PATHS.DOCTOR.REPORT_ACTIVITY_LOGS),
          id: [PATHS.DOCTOR.REPORT_ACTIVITY_LOGS],
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
          text: "Patient Accounts",
          icon: <AccountBoxIcon />,
          onClick: () => router.push(PATHS.STAFF.PATIENT_ACCOUNTS),
        },
        { text: "Divider" },
        {
          text: "Queue Today",
          icon: <QueueIcon />,
          onClick: () => router.push(PATHS.STAFF.QUEUE_TODAY),
        },
        {
          text: "Sunday Queue",
          icon: <QueueIcon />,
          onClick: () => router.push(PATHS.STAFF.QUEUE_SUNDAY),
        },
        // {
        //   text: "Queues",
        //   icon: <ViewListIcon />,
        //   onClick: () => router.push(PATHS.STAFF.QUEUE_MANAGEMENT),
        // },
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
          {sidebarItems.map(
            ({ id = [], text, icon, onClick, title }, index) => {
              if (text === "Divider")
                return <Divider key={index} sx={{ my: 1 }} />;

              // if (text === "Subheader")
              //   return <ListSubheader component="div">{title}</ListSubheader>;

              const selected = id.includes(router.pathname);
              return (
                <ListItem
                  key={text}
                  disablePadding
                  onClick={onClick}
                  selected={selected}
                >
                  <ListItemButton>
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              );
            }
          )}
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
