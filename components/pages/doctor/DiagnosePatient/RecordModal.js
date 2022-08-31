import React from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Toolbar,
  Typography,
} from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";
import { Datalist, Modal } from "../../../common";

const RecordModal = ({ open = false, data, onClose }) => {
  const {
    dateCreated,
    serviceName,
    branchName,
    doctorName,
    diagnosis,
    patientNote,
  } = data;

  const meicalRecord = [
    {
      label: "Date of Visit",
      value: formatTimeStamp(dateCreated, "MMM-dd-yyyy"),
    },
    {
      label: "Branch",
      value: branchName,
    },
    {
      label: "Service",
      value: serviceName,
    },
    {
      label: "Doctor",
      value: doctorName,
    },
  ];

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal width="xs" open={open} onClose={handleClose}>
      <Box sx={{ overflow: "overlay" }}>
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Medical Record
              </Typography>

              <Button color="inherit" onClick={handleClose}>
                Close
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2 }}>
          <Container maxWidth="lg">
            <Datalist data={meicalRecord} labelWidth={140} />
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom>Patient Note</Typography>
            <Typography
              variant="caption"
              sx={{ whiteSpace: "pre-line" }}
              component="div"
              fontWeight="500"
            >
              {patientNote || "-"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography gutterBottom>Diagnosis</Typography>
            <Typography
              variant="caption"
              sx={{ whiteSpace: "pre-line" }}
              component="div"
              fontWeight="500"
            >
              {diagnosis || "-"}
            </Typography>
          </Container>
        </Box>
      </Box>
    </Modal>
  );
};

export default RecordModal;
