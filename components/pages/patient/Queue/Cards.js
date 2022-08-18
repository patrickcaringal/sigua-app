import React from "react";

import { Box } from "@mui/material";

import QueueCard, { CARD_TYPES } from "./Card";

export const AdminCards = ({
  isRegOpen,
  isQueueOngoing,
  currentRegNo = "-",
  counters,
}) => {
  if (!isRegOpen && !isQueueOngoing) return null;

  return (
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
          queueNo={currentRegNo}
          title="Current Available Number"
          type={CARD_TYPES.OTHERS}
        />
      )}
      {isQueueOngoing &&
        counters.map((i) => (
          <QueueCard
            key={i.id}
            queueNo={i.queue.length ? i.queue[0].queueNo : "-"}
            title="Serving Number"
            type={CARD_TYPES.OTHERS}
          />
        ))}
    </Box>
  );
};

export const OwnCards = ({ myQueueItems }) => {
  return (
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
      {myQueueItems
        .sort((a, b) => a.queueNo - b.queueNo)
        .map((i) => (
          <QueueCard
            key={i.queueNo}
            queueNo={i.queueNo}
            title={i.patientName}
            type={CARD_TYPES.OWNED}
          />
        ))}
    </Box>
  );
};
