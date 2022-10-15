import React from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import { FormikProvider, useFormik } from "formik";

import { StaffSchema } from "../../../../modules/validation";
import { Modal } from "../../../common";
import Form from "./Form";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  staffs: [],
};

const defaultStaffValue = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthdate: "",
  gender: "",
  address: "",
  email: "",
  branch: "",
};

export default function ManageStaffModal({
  open = false,
  data,
  onClose,
  onSave,
  branches,
}) {
  const branchesMap = branches.reduce((acc, i) => {
    return { ...acc, [i.id]: i.name };
  }, {});

  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { staffs: [data] };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: StaffSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { staffs } = values;
      const mapped = staffs.map((i) => ({
        ...i,
        branchName: branchesMap[i.branch],
      }));

      onSave(mapped);
    },
  });

  const { handleSubmit, values, dirty, resetForm } = formik;

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
                {isCreate ? "Add" : "Edit"} Staff
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.staffs.length === 0 || !dirty}
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
              <Form {...formik} isCreate={isCreate} branches={branches} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Modal>
  );
}
