import React, { useEffect, useState } from "react";

import { Badge, Box, Button, Chip, Container, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  db,
  getFamilyMembersReq,
  registerToQueueReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
  today,
} from "../../../../modules/helper";
import { Toolbar, successMessage } from "../../../common";
import QueueCard, { CARD_TYPES } from "./Card";
import Placeholder from "./Placeholder";
import QueueModal from "./QueueModal";

const defaultModal = {
  open: false,
  data: {},
};

const TodayHeader = ({ date, branch }) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ fontWeight: "bold" }}
      >
        {branch}
      </Typography>
      <Typography
        variant="h6"
        color="text.secondary"
        sx={{ fontWeight: "semibold" }}
      >
        {formatTimeStamp(date, "MMM dd, yyyy (eee)")}
      </Typography>
    </Box>
  );
};

const PatientQueuePage = () => {
  const router = useRouter();
  const { branchId } = router.query;
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [registerToQueue] = useRequest(registerToQueueReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);

  const hasQueueToday = !!lodash.keys(queueToday).length;
  const isRegOpen = hasQueueToday ? queueToday.openForRegistration : false;
  const isQueueOngoing = hasQueueToday ? queueToday.openQueue : false;
  const myQueueItems = (queueToday?.queue || []).filter(
    (i) => i.accountId === user.id
  );

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

  const handleAddQueue = async (document) => {
    // Validate
    const patientAlreadyHasQueue = !!myQueueItems.filter(
      (i) => i.patientId === document.patientId
    ).length;

    if (patientAlreadyHasQueue) {
      return openResponseDialog({
        autoClose: true,
        content: `${document.patientName} is already registered on today's queue.`,
        type: "WARNING",
      });
    }

    // Register
    const payload = { id: queueToday.id, document };
    const { error: regError } = await registerToQueue(payload);
    if (regError) return openErrorDialog(regError);

    // Successful
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: document.patientName,
        verb: "registered to the Queue",
      }),
      type: "SUCCESS",
      closeCb() {
        setQueueModal(defaultModal);
      },
    });
  };

  const handleQueueModalOpen = () => {
    setQueueModal({
      open: true,
      data: {
        // branchId,
        accountId: user.id,
      },
    });
  };

  const handleQueueModalClose = () => {
    setQueueModal(defaultModal);
  };

  return (
    <Container maxWidth="lg">
      <Toolbar
        onRootClick={() => router.push("/dashboard")}
        paths={[{ text: "Queue Today" }]}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleQueueModalOpen}
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
          pb: 3,
          // border: "1px solid khaki",
        }}
      >
        {hasQueueToday ? (
          <>
            <TodayHeader
              date={queueToday.date}
              branch={queueToday.branchName}
            />
            {/* Status chips */}
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              {isRegOpen ? (
                <Chip label="Registration Open" color="primary" size="large" />
              ) : (
                <Chip label="Registration Close" color="error" size="large" />
              )}
              {isQueueOngoing ? (
                <Chip label="Queue Ongoing" color="primary" size="large" />
              ) : (
                <Chip label="Queue Close" color="error" size="large" />
              )}
            </Box>

            <Box
              sx={{
                pt: 5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                gap: { xs: 3 },
              }}
            >
              {/* Others Cards */}
              <Box
                sx={{
                  flex: 1,
                  // border: "1px solid red",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {isRegOpen && (
                  <QueueCard
                    queueNo={queueToday.nextQueueNo}
                    title="Current Available Number"
                    type={CARD_TYPES.OTHERS}
                  />
                )}
                {isQueueOngoing && (
                  <QueueCard
                    queueNo={undefined}
                    title="Serving Number"
                    type={CARD_TYPES.OTHERS}
                  />
                )}
              </Box>

              {/* Own Cards */}
              <Box
                sx={{
                  flex: 1,
                  // border: "1px solid blue",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                {myQueueItems.map((i) => (
                  <QueueCard
                    key={i.queueNo}
                    queueNo={i.queueNo}
                    title={i.patientName}
                    type={CARD_TYPES.OWNED}
                  />
                ))}
              </Box>
            </Box>
          </>
        ) : (
          <Placeholder />
        )}

        {queueModal.open && (
          <QueueModal
            open={queueModal.open}
            data={queueModal.data}
            onClose={handleQueueModalClose}
            onSave={!queueModal.data?.id ? handleAddQueue : () => {}}
            header={
              <TodayHeader
                date={queueToday.date}
                branch={queueToday.branchName}
              />
            }
          />
        )}
      </Box>
    </Container>
  );
};

export default PatientQueuePage;
