import React, { useEffect, useState } from "react";

import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { changePasswordReq } from "../../../../modules/firebase";
import {
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
} from "../../../../modules/helper";
import { ChangePassSchema } from "../../../../modules/validation";
import { successMessage } from "../../../common";
import { Input } from "../../../common/Form";

const PasswordPage = ({ data, onSave }) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [changePassword] = useRequest(changePasswordReq, setBackdropLoader);

  const formik = useFormik({
    initialValues: {
      password: "", // 12345678
      newPassword: "",
      matchPassword: "",
    },
    validationSchema: ChangePassSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Update
      const payload = {
        oldPassword: values.password,
        newPassword: values.newPassword,
      };
      const { error } = await changePassword(payload);
      if (error) return openErrorDialog(error);

      // Successful
      openResponseDialog({
        autoClose: true,
        content: successMessage({ noun: "Password", verb: "updated" }),
        type: "SUCCESS",
      });
    },
  });

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    submitForm,
  } = formik;
  const getError = (field) => touched?.[field] && errors?.[field];

  if (!Object.keys(values).length) return null;

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mb: 4 }} fontWeight="bold">
        Password
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            type="password"
            required
            label="Password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("password")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            type="password"
            required
            label="New Password"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("newPassword")}
          />
        </Grid>
        <Grid item xs={12}>
          <Input
            type="password"
            required
            label="Retype Password"
            name="matchPassword"
            value={values.matchPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={getError("matchPassword")}
          />
        </Grid>
      </Grid>

      <Button
        variant="contained"
        size="small"
        onClick={submitForm}
        sx={{ mt: 3 }}
      >
        save changes
      </Button>
    </Container>
  );
};

export default PasswordPage;
