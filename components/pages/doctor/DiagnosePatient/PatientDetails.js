import React from "react";

import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import lodash from "lodash";

import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { Datalist } from "../../../common";

const PatientDetails = ({ patient = {} }) => {
  const hasPatient = !!lodash.keys(patient).length;

  const {
    queueNo,
    name,
    gender,
    birthdate,
    contactNo,
    address,
    serviceName,
    patientNote,
  } = patient;

  const patientData = hasPatient
    ? [
        {
          label: "Birthdate",
          value: formatTimeStamp(birthdate, "MMM-dd-yyyy"),
        },
        {
          label: "Age",
          value: calculateAge(formatTimeStamp(birthdate)),
        },
        {
          label: "Gender",
          value: gender,
        },
        {
          label: "Contact No.",
          value: contactNo,
        },
      ]
    : [];

  const visitData = hasPatient
    ? [
        {
          label: "Service",
          value: serviceName,
        },
      ]
    : [];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.light",
            width: 60,
            height: 60,
            fontSize: 40,
            mb: 2,
          }}
        >
          {queueNo || "-"}
        </Avatar>

        <Typography fontWeight="medium">{name}</Typography>
      </Box>

      {/* Patient Details */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          px: 3,
          pb: 3,
        }}
      >
        <Datalist data={patientData} />
        <Typography sx={{ mt: 1 }} gutterBottom>
          Address
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: "4",
            overflow: "hidden",
          }}
          component="div"
          fontWeight="500"
        >
          {address}
        </Typography>
      </Box>

      <Divider />

      {/* Visit Details */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Visit Details
        </Typography>

        <Datalist data={visitData} />
        <Typography sx={{ mt: 1 }} gutterBottom>
          Patient Note
        </Typography>
        <Typography variant="caption" component="div" fontWeight="500">
          {patientNote || "-"}
        </Typography>
      </Box>
    </Box>
  );
};

export default PatientDetails;
