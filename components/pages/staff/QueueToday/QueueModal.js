import React, { useEffect } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import { formatTimeStamp } from "../../../../modules/helper";
import { QueueSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const dateToday = formatTimeStamp(new Date());

const defaultValues = {
  date: dateToday,
  branchId: "",
  capacity: "",
};

const QueueModal = ({
  open = false,
  data,
  onClose,
  onSave,
  branches,
  isStaff,
}) => {
  const isCreate = !data?.id;
  const initialValues = isCreate ? { ...defaultValues, ...data } : { data };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: QueueSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const name = branches.find((i) => i.id === values.branchId).name || "";
      onSave({ ...values, branchName: name });
    },
  });

  const { handleSubmit, resetForm } = formik;

  useEffect(() => {
    if (!open) resetForm();
  }, [open, resetForm]);

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
                {isCreate ? "Add" : "Edit"} Queue
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                // disabled={!dirty}
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
            <Container maxWidth="lg">
              <Form
                {...formik}
                isCreate={isCreate}
                branches={branches}
                isStaff={isStaff}
              />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Modal>
  );
};

export default QueueModal;
