import React from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import faker from "faker";
import { FormikProvider, useFormik } from "formik";

import { Modal } from "../../../../components/common";
import { isMockDataEnabled } from "../../../../modules/env";
import { FamilyMemberSchema } from "../../../../modules/validation";
import Form from "./Form";

const defaultValues = isMockDataEnabled
  ? {
      firstName: faker.name.firstName().toUpperCase(),
      suffix: "",
      lastName: faker.name.lastName().toUpperCase(),
      middleName: faker.name.lastName().toUpperCase(),
      address: faker.lorem.paragraph().toUpperCase(),
      birthdate: faker.date.past(
        faker.datatype.number({
          min: 10,
          max: 50,
        })
      ),
      gender: faker.random.arrayElement(["male", "female"]),
      contactNo: faker.phone.phoneNumber("09#########"),
    }
  : {};

const ManageFamilyMemberModal = ({ open = false, data, setOpen, onSave }) => {
  const isCreate = !data?.id;
  const initialValues = {
    familyMembers: [data],
  };

  const formik = useFormik({
    initialValues,
    // validationSchema: FamilyMemberSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { familyMembers } = values;

      if (isCreate) {
        onSave(
          familyMembers.map((i) => ({
            ...i,
            accountId: data?.accountId,
          }))
        );
      }
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
              <Form {...formik} isCreate={false} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Modal>
  );
};

export default ManageFamilyMemberModal;
