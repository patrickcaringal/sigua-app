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

import { Modal } from "../../../../components/common";
import { FamilyMemberSchema } from "../../../../modules/validation";
import Form from "./Form";

const defaultValues = {
  familyMembers: [],
};

const ManageFamilyMemberModal = ({ open, data, setOpen, onSave }) => {
  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { familyMembers: [data] };

  const formik = useFormik({
    initialValues,
    validationSchema: FamilyMemberSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // automatic unverified family member
      const { familyMembers } = values;
      onSave(familyMembers);
    },
  });

  const { handleSubmit, values, resetForm, dirty } = formik;

  const handleClose = () => {
    setOpen(false);
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
                {isCreate ? "Add" : "Edit"} Family Member
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.familyMembers.length === 0 || !dirty}
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
};

export default ManageFamilyMemberModal;
