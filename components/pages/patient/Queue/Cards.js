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
            title="Now Serving Number"
            type={CARD_TYPES.OTHERS}
          />
        ))}
    </Box>
  );
};

export const OwnCards = ({ queueNumbers, myQueueItems }) => {
  const { skippedNumbers, servingNumbers, nextNumbers, doneNumbers } =
    queueNumbers;

  const getCardType = (queueNo) => {
    if (servingNumbers.includes(queueNo)) {
      return CARD_TYPES.OWNED_SERVING;
    }

    if (skippedNumbers.includes(queueNo)) {
      return CARD_TYPES.OWNED_SKIPPED;
    }

    if (nextNumbers.includes(queueNo)) {
      return CARD_TYPES.OWNED_NEXT;
    }

    return CARD_TYPES.OWNED;
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
      }}
    >
      {myQueueItems
        .sort((a, b) => a.queueNo - b.queueNo)
        .map((i) => {
          if (doneNumbers.includes(i.queueNo)) return null;

          return (
            <QueueCard
              key={i.queueNo}
              queueNo={i.queueNo}
              title={i.patientName}
              type={getCardType(i.queueNo)}
            />
          );
        })}
    </Box>
  );
};
