import React, { useEffect, useState } from "react";

import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
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
  MEMBER_STATUS,
  addPatientReq,
  db,
  getFamilyMembersReq,
  updatePatientReq,
  uploadImageReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
  today,
} from "../../../../modules/helper";
import { Toolbar, successMessage } from "../../../common";
import { MobileNumberVerificationModal } from "../../../shared";
// import Cards from "./Cards";
// import ManageFamilyMemberModal from "./ManageFamilyMemberModal";
// import UploadAttachmentModal from "./UploadAttachmentModal";

const defaultModal = {
  open: false,
  data: {},
};

const PatientQueuePage = () => {
  const router = useRouter();
  const { branchId } = router.query;
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getFamilyMembers] = useRequest(getFamilyMembersReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});

  const hasQueueToday = !!lodash.keys(queueToday).length;
  const isRegOpen = hasQueueToday ? queueToday.openForRegistration : false;
  const isQueueOpen = hasQueueToday ? queueToday.openQueue : false;

  useEffect(() => {
    const q = query(
      collection(db, "queues"),
      where("branchId", "==", branchId),
      where("queueDate", "==", today)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length === 1) {
        const realtimeData = querySnapshot.docs[0].data();
        setQueueToday(realtimeData);
      } else if (querySnapshot.docs.length > 1) {
        alert("detected more than 1 queue today");
        setQueueToday({});
      } else {
        // console.log("no queue");
        setQueueToday({});
      }
    });

    return () => unsub();
  }, [branchId]);

  if (!hasQueueToday) return null;

  return (
    <Container maxWidth="lg">
      <Toolbar
        onRootClick={() => router.push("/dashboard")}
        paths={[{ text: "Queue Today" }]}
      >
        <Button
          variant="contained"
          size="small"
          // onClick={handleMemberModalOpen}
          disabled={!isRegOpen}
        >
          Get Queue Number
        </Button>
      </Toolbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mt: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 2 }}>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ fontWeight: "bold" }}
          >
            {queueToday.branchName}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontWeight: "semibold" }}
          >
            {formatTimeStamp(queueToday.date, "MMM dd, yyyy (eee)")}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
          {isRegOpen ? (
            <Chip label="Registration Open" color="primary" size="large" />
          ) : (
            <Chip label="Registration Close" color="warning" size="large" />
          )}
          {isQueueOpen ? (
            <Chip label="Queue Ongoing" color="primary" size="large" />
          ) : (
            <Chip label="Queue Close" color="warning" size="large" />
          )}
        </Box>

        <Box sx={{ pt: 5, display: "flex", flexDirection: "column", gap: 3 }}>
          {/* <Card
            sx={{
              width: 296,
              height: 208,
              color: "warning.light",
            }}
          >
            <CardActionArea
              sx={{
                width: "inherit",
                height: "inherit",
                border: "6px solid #ff9800",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "semibold" }}>
                  Your Queue #
                </Typography>
                <Typography
                  variant="h2"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  100
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card> */}

          <Card
            sx={{
              width: 296,
              height: 208,
              color: "primary.main",
            }}
          >
            <CardActionArea
              sx={{
                width: "inherit",
                height: "inherit",
                border: "6px solid #009FFE",
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "semibold" }}>
                  Now Serving
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "semibold" }}>
                  Number
                </Typography>
                <Typography
                  variant="h2"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  100
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default PatientQueuePage;
