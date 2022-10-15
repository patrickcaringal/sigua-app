import React from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { REG_TYPE } from "../../../../../modules/firebase";
import { RegisterForQueueSchema } from "../../../../../modules/validation";
import { Modal } from "../../../../common";
import Form from "./Form";
import TodayHeader from "./Header";

const ManualRegistrationModal = ({
  open = false,
  data: queueData,
  onSave,
  onClose,
}) => {
  const formik = useFormik({
    initialValues: {
      accountId: "",
      serviceId: "",
      serviceName: "",
      patientId: "",
      patientName: "",
      patientContactNo: "",
      patientNote: "",
    },
    validationSchema: RegisterForQueueSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        registrationType: REG_TYPE.STAFF_REGISTERED,
      };
      onSave(payload);
    },
  });

  const { handleSubmit, values, resetForm, dirty } = formik;

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ overflow: "overlay" }}
      >
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Manual Registration
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={!dirty}
              >
                save
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2 }}>
          <Container maxWidth="lg" sx={{ pt: 2 }}>
            <TodayHeader date={queueData.date} branch={queueData.branch} />
            <Form {...formik} />
          </Container>
        </Box>
      </Box>
    </Modal>
  );
};

export default ManualRegistrationModal;
