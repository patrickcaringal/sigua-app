import React, { Fragment, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import QueueIcon from "@mui/icons-material/Queue";
import RestoreIcon from "@mui/icons-material/Restore";
import StopIcon from "@mui/icons-material/Stop";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addQueueReq,
  db,
  getBranchDoctorsReq,
  getQueuesReq,
  resetQueueReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  localUpdateDocs,
  pluralize,
  today,
} from "../../../../modules/helper";
import { PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer, DoctorDialog } from "../../../shared";
import Header from "./Header";
import Placeholder from "./Placeholder";
import QueueList from "./QueueList";
import ManageQueueModal from "./QueueModal";
import ToolbarButtons from "./ToolbarButtons";

const TransferModal = ({
  open,
  data,
  doctors,
  //   branchId,
  //   queueDoctors,
  //   onDoctorSelect,
  onTransferSelect,
  onClose,
}) => {
  const { patient, from } = data;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TRANSFER PATIENT TO</DialogTitle>
      <List sx={{ pt: 0 }}>
        {doctors.map((i) => {
          const { id, name } = i;

          return (
            <ListItem
              button
              onClick={() => {
                onTransferSelect({
                  ...data,
                  doctor: i,
                  to: `counters.${id}.queue`,
                });
                handleClose();
              }}
              key={id}
            >
              <ListItemText primary={name} sx={{ textAlign: "center" }} />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};

export default TransferModal;
