import React, { useEffect, useState } from "react";

import { Avatar, Box, Button, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addQueueCounterReq,
  addQueueReq,
  db,
  getBranchesReq,
  resetQueueReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  pluralize,
  today,
} from "../../../../modules/helper";
import { PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";

const defaultModal = {
  open: false,
  data: {},
};

const QueueManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});

  const doctorId = user.id;
  const hasQueueToday = !!lodash.keys(queueToday).length;

  //   const currentPatient = queueToday?.counters[doctorId]?.queue[0];

  useEffect(() => {
    const q = query(
      collection(db, "queues"),
      where("queueDate", "==", today),
      where("doctors", "array-contains", doctorId)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length === 1) {
        const realtimeData = querySnapshot.docs[0].data();
        setQueueToday(realtimeData);
      } else if (querySnapshot.docs.length > 1) {
        alert("detected more than 1 queue today");
        setQueueToday({});
      } else {
        setQueueToday({});
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DIAGNOSE),
        paths: [{ text: "Diagnose Patient" }],
      }}
      //   toolbarContent={}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "240px auto",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "1px solid red",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "primary.light",
              width: 80,
              height: 80,
              fontSize: 40,
            }}
          >
            P
          </Avatar>

          <Typography
            // color="text.secondary"
            // sx={{ fontWeight: "bold" }}
            fontWeight="medium"
          >
            Patrick Angelo Caringal
          </Typography>
        </Box>
        <Box sx={{ border: "1px solid blue" }}>Medical records</Box>
      </Box>
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
