import React from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import { RegisterForQueueSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const defaultValues = {
  branchId: "",
  serviceId: "",
  serviceName: "",
  patientId: "",
  patientName: "",
  patientContactNo: "",
  patientNote: "",
};

const ManageFamilyMemberModal = ({
  open = false,
  data,
  onClose,
  onSave,
  header,
}) => {
  const isCreate = !data?.id;
  const initialValues = isCreate ? { ...defaultValues, ...data } : { data };

  const formik = useFormik({
    initialValues,
    validationSchema: RegisterForQueueSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // console.log(JSON.stringify(values, null, 4));
      onSave(values);
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
                {isCreate ? "Get Queue Number" : "Edit"}
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
          <FormikProvider value={formik}>
            <Container maxWidth="lg" sx={{ pt: 2 }}>
              {header}
              <Form {...formik} isCreate={isCreate} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Modal>
  );
};

export default ManageFamilyMemberModal;
