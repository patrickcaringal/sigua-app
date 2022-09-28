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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
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
  getQueuesByBranchReq,
  getQueuesTodayReq,
  resetQueueReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  localUpdateDocs,
  pluralize,
  saturdayThisWeek,
  today,
} from "../../../../modules/helper";
import { PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer, DoctorDialog } from "../../../shared";
import Header from "./Header";
import Placeholder from "./Placeholder";
import QueueList from "./QueueList";
import ManageQueueModal from "./QueueModal";
import ToolbarButtons from "./ToolbarButtons";

const DoctorsModal = ({
  open,
  branchId,
  queueDoctors,
  onDoctorSelect,
  date = today,
  onClose,
}) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getBranchDoctor] = useRequest(getBranchDoctorsReq, setBackdropLoader);
  const [getQueuesToday] = useRequest(getQueuesTodayReq, setBackdropLoader);

  // Local States
  const [doctors, setDoctors] = useState([]);
  const [unavailableDoctors, setUnavailableDoctors] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchDoctors = async () => {
        // Get Doctors
        const payload = { branchId };
        const { data: doctorList, error: getError } = await getBranchDoctor(
          payload
        );
        if (getError) return openErrorDialog(getError);

        const mapped = doctorList.reduce((acc, i) => {
          if (queueDoctors.includes(i.id)) return acc;
          const d = { ...lodash.pick(i, ["name", "id"]) };
          return [...acc, d];
        }, []);

        setDoctors(mapped);
      };

      const fetchQueuesToday = async () => {
        // Get Doctors
        const payload = { today: date };
        const { data, error: getError } = await getQueuesToday(payload);
        if (getError) return openErrorDialog(getError);

        const unavailDoctors = data.reduce((acc, i) => {
          i.doctors.forEach((d) => {
            acc.add(d);
          });
          return acc;
        }, new Set());

        setUnavailableDoctors(Array.from(unavailDoctors));
      };

      fetchDoctors();
      fetchQueuesToday();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <DoctorDialog
      open={open}
      data={doctors.filter((i) => !unavailableDoctors.includes(i.id))}
      onItemClick={onDoctorSelect}
      onClose={onClose}
    />
  );
};

export default DoctorsModal;
