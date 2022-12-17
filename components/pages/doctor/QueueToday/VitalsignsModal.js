import React, { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  InputAdornment,
  Toolbar,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import _ from "lodash";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getPatientReq, updatePatientReq } from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { VitalSignsSchema } from "../../../../modules/validation";
import { Input, Modal } from "../../../common";

const defaultValues = {
  bodyTemperature: "",
  pulseRate: "",
  bloodPressure: "",
  height: "",
  weight: "",
};

const VitalSignstModal = ({ open = false, data, onClose, onSave }) => {
  const { patientId, patientName } = data?.patient;
  const { openErrorDialog, openResponseDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);
  const [updatePatient] = useRequest(updatePatientReq, setBackdropLoader);

  // Local States
  const [patient, setPatient] = useState({});

  useEffect(() => {
    const fetchPatient = async () => {
      const payload = { id: patientId };
      const { data, error } = await getPatient(payload);
      if (error) return openErrorDialog(error);

      setPatient(data);
    };

    fetchPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formik = useFormik({
    initialValues: {
      ...defaultValues,
      ..._.pick(patient, _.keys(defaultValues)),
    },
    validationSchema: VitalSignsSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      values = _.toPairs(values).reduce(
        (acc, [k, v]) => ({ ...acc, [k]: `${v}` }),
        {}
      );

      const payload = {
        patient: {
          id: patientId,
          ...values,
        },
      };
      const { error } = await updatePatient(payload);
      if (error) return openErrorDialog(error);

      onSave(data);

      handleClose();
    },
  });

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    submitForm,
    resetForm,
  } = formik;
  const getError = (field) => touched?.[field] && errors?.[field];

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Vital Signs Checking"
      maxWidth="xs"
    >
      <AppBar sx={{ position: "sticky" }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography sx={{ flex: 1 }} variant="h6" component="div">
              Vital Signs
            </Typography>

            <Button color="inherit" sx={{ mr: 2 }} onClick={submitForm}>
              save
            </Button>
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ py: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" sx={{ mb: 2 }}>
            {patientName}
          </Typography>

          <Input
            type="number"
            value={values.bodyTemperature}
            label="Body temperature (°C)"
            name="bodyTemperature"
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("bodyTemperature")}
            sx={{ mb: 2 }}
            placeholder="36"
          />

          <Input
            type="number"
            value={values.pulseRate}
            label="Pulse rate (beats per minute)"
            name="pulseRate"
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("pulseRate")}
            sx={{ mb: 2 }}
            placeholder="80"
          />

          <Input
            value={values.bloodPressure}
            label="Blood pressure"
            name="bloodPressure"
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("bloodPressure")}
            sx={{ mb: 2 }}
            placeholder="120/80"
          />

          <Input
            type="number"
            value={values.height}
            label="Height (CM)"
            name="height"
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("height")}
            sx={{ mb: 2 }}
            placeholder="178"
          />

          <Input
            type="number"
            value={values.weight}
            label="Weight (KG)"
            name="weight"
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("weight")}
            sx={{ mb: 2 }}
            placeholder="60"
          />
        </Container>
      </Box>
    </Modal>
  );
};

export default VitalSignstModal;
