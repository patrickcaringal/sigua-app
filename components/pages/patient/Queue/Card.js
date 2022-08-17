import React from "react";

import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

export const CARD_TYPES = {
  OWNED: "OWNED",
  OTHERS: "OTHERS",
};

const CardComponent = ({
  queueNo = "-",
  title,
  subtitle,
  type = CARD_TYPES.OTHERS,
}) => {
  const isOwned = type === CARD_TYPES.OWNED;

  return (
    <Card
      key={title}
      sx={{
        width: 240,
        height: 250,
        color: isOwned ? "warning.light" : "primary.main",
      }}
    >
      <CardActionArea
        sx={{
          width: "inherit",
          height: "inherit",
          border: `6px solid ${isOwned ? "#ff9800" : "#009FFE"}`,
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
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardComponent;
