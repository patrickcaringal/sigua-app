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

// import { ServicesSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const defaultValues = {
  announcements: [
    {
      image: "",
      title: "",
      content: "",
    },
  ],
};

export default function ManageAnnouncementModal({
  open = false,
  data,
  onClose,
  onSave,
}) {
  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { announcements: [data] };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: announcementsSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { announcements } = values;
      onSave(announcements);
    },
  });

  const { handleSubmit, values, dirty, resetForm } = formik;

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
                {isCreate ? "Add" : "Edit"} Announcement
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.announcements.length === 0 || !dirty}
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
              <Form {...formik} isCreate={isCreate} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Modal>
  );
}
