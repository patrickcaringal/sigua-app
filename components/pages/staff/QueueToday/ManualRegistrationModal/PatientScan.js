import React, { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";

import { Input, Modal } from "../../../../common";
import PatientsSearch from "./PatientsSearch";

const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});

const MODE = {
  SCAN: "SCAN",
  SEARCH: "SEARCH",
};

const PatientSelectModal = ({ onPatientSelect }) => {
  const handleScanFile = (result) => {
    if (result) {
      onPatientSelect(result);
    }
  };

  const handleErrorFile = (error) => {
    console.error(error);
  };

  const handleRescanFile = () => {
    setPatientId(null);
  };

  return (
    <Box style={{ width: "100%" }}>
      <QrReader
        delay={1000}
        onError={handleErrorFile}
        onScan={handleScanFile}
        style={{ width: "100%" }}
      />
    </Box>
  );
};

export default PatientSelectModal;
