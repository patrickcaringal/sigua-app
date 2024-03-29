import React from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import EditIcon from "@mui/icons-material/Edit";
import FilterListIcon from "@mui/icons-material/FilterList";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import QrCodeIcon from "@mui/icons-material/QrCode";
import RestoreIcon from "@mui/icons-material/Restore";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import { IconButton, Tooltip } from "@mui/material";
export const ACTION_BUTTONS = {
  DETAILS: "DETAILS",
  DETAILS_QUEUE: "DETAILS_QUEUE",
  ADD_USER: "ADD_USER",
  EDIT: "EDIT",
  DELETE: "DELETE",
  RESTORE: "RESTORE",
  // specific
  VIEW_FAMILY_MEMBERS: "VIEW_FAMILY_MEMBERS",
  GENERATE_QR_CODE: "GENERATE_QR_CODE",
  VERIFY_MOBILE: "VERIFY_MOBILE",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
};

export const ACTION_ICONS = {
  DETAILS: <AssignmentIcon />,
  DETAILS_QUEUE: <ListAltIcon />,
  ADD_USER: <PersonAddIcon />,
  EDIT: <EditIcon />,
  DELETE: <DeleteIcon />,
  RESTORE: <RestoreIcon />,
  // specific
  VIEW_FAMILY_MEMBERS: <PeopleIcon />,
  GENERATE_QR_CODE: <QrCodeIcon />,
  EXPORT: <DownloadForOfflineIcon />,
  FILTER: <FilterListIcon />,
  CLEAR: <ClearIcon />,
  VERIFY_MOBILE: <SendToMobileIcon />,
  APPROVE: <CheckIcon />,
  REJECT: <CloseIcon />,
};

const getButton = ({ tooltipText = "", action, onClick }) => {
  return (
    <Tooltip key={action} title={tooltipText}>
      <IconButton size="small" onClick={onClick}>
        {ACTION_ICONS[action]}
      </IconButton>
    </Tooltip>
  );
};

export const getActionButtons = (actions) => {
  return actions.map((i) => getButton(i));
};
