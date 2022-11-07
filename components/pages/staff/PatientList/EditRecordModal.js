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
import { useFormik } from "formik";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { updateMedicalRecordReq } from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { Datalist, Input, Modal, successMessage } from "../../../common";

const EditRecordModal = ({ open = false, data, onClose, onSave }) => {
  const {
    id,
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

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [updateMedicalRecord] = useRequest(
    updateMedicalRecordReq,
    setBackdropLoader
  );

  const formik = useFormik({
    initialValues: { diagnosis },
    // validationSchema: DiagnoseSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = { updates: { id, ...values } };
      const { error } = await updateMedicalRecord(payload);
      if (error) return openErrorDialog(error);

      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Medical record",
          verb: "updated",
        }),
        type: "SUCCESS",
      });
      onSave();
      onClose();
    },
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal width="xs" open={open} onClose={handleClose}>
      <Box sx={{ overflow: "overlay" }}>
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ flex: 1 }} variant="h6" component="div">
                Edit Medical Record
              </Typography>

              <Button color="inherit" onClick={formik.submitForm}>
                Save
              </Button>
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
            <Input
              required
              multiline
              label="Doctor Diagnosis"
              name="diagnosis"
              rows={5}
              value={formik.values.diagnosis}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.diagnosis && formik.errors.diagnosis}
            />
          </Container>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditRecordModal;
