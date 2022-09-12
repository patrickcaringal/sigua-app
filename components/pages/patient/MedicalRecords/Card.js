import React from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";

import { LongTypography } from "../../../../components/common";
import { formatTimeStamp } from "../../../../modules/helper";

const CardComponent = ({ data }) => {
  const {
    dateCreated,
    serviceName,
    branchName,
    doctorName,
    diagnosis,
    patientNote,
  } = data;

  return (
    <Card
      sx={{
        width: { xs: "100%", md: 560 },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={<Typography variant="h6">{serviceName}</Typography>}
        subheader={formatTimeStamp(dateCreated, "MMMM dd, yyyy")}
      />
      <CardContent sx={{ pt: 0, pb: 1, flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            mb: 1,
          }}
        >
          <Typography variant="body2">{branchName}</Typography>
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
          />
          <Typography variant="body2">DR. {doctorName}</Typography>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }} gutterBottom>
          Patient Note
        </Typography>
        <LongTypography text={patientNote} color="text.secondary" />

        <Typography variant="body2" sx={{ mt: 2 }} gutterBottom>
          Diagnosis
        </Typography>
        <LongTypography text={diagnosis} color="text.secondary" />
      </CardContent>
    </Card>
  );
};

export default CardComponent;
