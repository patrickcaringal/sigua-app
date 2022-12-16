import React, { useEffect, useState } from "react";

import { Box, Button, Container, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  checkPatientHasQueueReq,
  db,
  registerToQueueReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
  saturdayThisWeek,
  today,
} from "../../../../modules/helper";
import { Toolbar, successMessage } from "../../../common";
import { AdminCards, OwnCards } from "./Cards";
import Placeholder from "./Placeholder";
import QueueModal from "./QueueModal";
import StatusChips from "./StatusChips";

const defaultModal = {
  open: false,
  data: {},
};

const baseday = saturdayThisWeek.formatted;

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
  const branchId = router.query.id;
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [registerToQueue] = useRequest(registerToQueueReq, setBackdropLoader);
  const [checkPatientHasQueue] = useRequest(
    checkPatientHasQueueReq,
    setBackdropLoader
  );

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [queueModal, setQueueModal] = useState(defaultModal);

  const isQueueFull = queueToday?.nextQueueNo - 1 === queueToday?.capacity;
  const hasQueueToday = !!lodash.keys(queueToday).length;
  const isRegOpen = hasQueueToday
    ? queueToday.openForRegistration && !isQueueFull
    : false;
  const isQueueOngoing = hasQueueToday ? queueToday.openQueue : false;

  const nextNumbers = queueToday?.next?.map((i) => i.queueNo);
  const skippedNumbers = queueToday?.skipped?.map((i) => i.queueNo);
  const doneNumbers = queueToday?.done?.map((i) => i.queueNo);
  const doctorCounters = lodash.values(queueToday?.counters);
  const servingNumbers = doctorCounters.reduce(
    (acc, i) => [...acc, ...i.queue.map((j) => j.queueNo)],
    []
  );

  useEffect(() => {
    const q = query(
      collection(db, "queues"),
      where("branchId", "==", branchId),
      where("queueDate", "==", baseday)
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

    const { data: hasQueueOtherBranch, error } = await checkPatientHasQueue({
      date: baseday,
      patientId: document.patientId,
    });
    if (error) return openErrorDialog(error);

    if (hasQueueOtherBranch) {
      return openResponseDialog({
        autoClose: true,
        content: `${document.patientName} is already registered on today's queue with other branch.`,
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

  const mergedQueueItems = () => {
    const queue =
      queueToday?.queue?.filter((i) => i.accountId === user.id) || [];
    const next = queueToday?.next?.filter((i) => i.accountId === user.id) || [];
    const counters =
      doctorCounters
        ?.reduce((a, i) => [...a, ...i.queue], [])
        .filter((i) => i.accountId === user.id) || [];
    const skipped =
      queueToday?.skipped?.filter((i) => i.accountId === user.id) || [];
    const done = queueToday?.done?.filter((i) => i.accountId === user.id) || [];

    return [...queue, ...next, ...counters, ...skipped, ...done];
  };

  const myQueueItems = mergedQueueItems();

  return (
    <Container maxWidth="lg">
      <Toolbar
        onRootClick={() => router.push("/dashboard")}
        paths={[{ text: "Sunday Queue" }]}
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
        }}
      >
        {hasQueueToday ? (
          <>
            <TodayHeader
              date={queueToday.date}
              branch={queueToday.branchName}
            />
            <StatusChips
              isRegOpen={isRegOpen}
              isQueueOngoing={isQueueOngoing}
              registered={queueToday?.nextQueueNo - 1}
              capacity={queueToday?.capacity}
            />
            <Box
              sx={{
                pt: 5,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                gap: { xs: 3 },
              }}
            >
              <AdminCards
                isRegOpen={isRegOpen}
                isQueueOngoing={isQueueOngoing}
                currentRegNo={queueToday.nextQueueNo}
                counters={doctorCounters}
              />
              <OwnCards
                queueNumbers={{
                  skippedNumbers,
                  servingNumbers,
                  nextNumbers,
                  doneNumbers,
                }}
                myQueueItems={myQueueItems}
              />
            </Box>
          </>
        ) : (
          <Placeholder
            text={`${formatTimeStamp(
              saturdayThisWeek.date,
              "MMM dd, yyyy (eee)"
            )}`}
          />
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
