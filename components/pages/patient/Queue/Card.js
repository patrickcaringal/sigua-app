import React from "react";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export const CARD_TYPES = {
  OWNED: "OWNED",
  OWNED_NEXT: "OWNED_NEXT",
  OWNED_SERVING: "OWNED_SERVING",
  OWNED_SKIPPED: "OWNED_SKIPPED",
  OTHERS: "OTHERS",
};

const textColor = {
  OWNED: "warning.light",
  OWNED_NEXT: "warning.light",
  OWNED_SERVING: "success.light",
  OWNED_SKIPPED: "error.light",
  OTHERS: "primary.main",
};

const borderColor = {
  OWNED: "#ff9800",
  OWNED_NEXT: "#ff9800",
  OWNED_SERVING: "#4caf50",
  OWNED_SKIPPED: "#ef5350",
  OTHERS: "#009FFE",
};

const statusText = {
  OWNED_NEXT: "Proceed to Clinic",
  OWNED_SERVING: "Serving",
  OWNED_SKIPPED: "Skipped",
};

const CardComponent = ({
  queueNo = "-",
  title,
  subtitle,
  type = CARD_TYPES.OTHERS,
}) => {
  const isOwned = [
    CARD_TYPES.OWNED_SERVING,
    CARD_TYPES.OWNED_SKIPPED,
    CARD_TYPES.OWNED_NEXT,
    CARD_TYPES.OWNED,
  ].includes(type);

  return (
    <Card
      key={title}
      sx={{
        width: 240,
        height: 250,
        color: textColor[type],
      }}
    >
      <CardActionArea
        sx={{
          width: "inherit",
          height: "inherit",
          border: `6px solid ${borderColor[type]}`,
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant={isOwned ? "body1" : "h6"}
            sx={{ fontWeight: "bold", textAlign: "center" }}
          >
            {title}
          </Typography>
          <Typography
            variant="h2"
            component="div"
            sx={{ fontWeight: "bold", mt: 2 }}
          >
            {queueNo}
          </Typography>
          {statusText[type] && (
            <Typography variant="caption" sx={{ fontWeight: "bold", mt: 2 }}>
              {statusText[type]}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardComponent;
