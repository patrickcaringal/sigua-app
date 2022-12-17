import React from "react";

import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import lodash from "lodash";

import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { Datalist } from "../../../common";

const PatientDetails = ({ patient = {} }) => {
  const hasPatient = !!lodash.keys(patient).length;

  const {
    name,
    gender,
    birthdate,
    contactNo,
    address,
    // vitals
    bodyTemperature,
    pulseRate,
    bloodPressure,
    height,
    weight,
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
        {
          label: "Body Temp",
          value: bodyTemperature ? `${bodyTemperature} °C` : "-",
        },
        {
          label: "Pulse Rate",
          value: pulseRate ? `${pulseRate} beats per minute` : "-",
        },
        {
          label: "Blood Pressure",
          value: bloodPressure ? bloodPressure : "-",
        },
        {
          label: "Height",
          value: height ? `${height} cm` : "-",
        },
        {
          label: "Weight",
          value: weight ? `${weight} kg` : "-",
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
          {name ? name.charAt(0) : "-"}
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
    </Box>
  );
};

export default PatientDetails;
