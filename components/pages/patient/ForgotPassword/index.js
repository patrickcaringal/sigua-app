import React, { useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import faker from "faker";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  checkContactNoReq,
  resetPasswordReq,
} from "../../../../modules/firebase";
import { getUniquePersonId } from "../../../../modules/helper";
import { PatientForgotPasswordSchema } from "../../../../modules/validation";
import { PATHS } from "../../../common";

const ForgotPassword = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  const [checkContactNo] = useRequest(checkContactNoReq, setBackdropLoader);
  const [resetPassword] = useRequest(resetPasswordReq, setBackdropLoader);

  const formik = useFormik({
    initialValues: { contactNo: "" },
    validationSchema: PatientForgotPasswordSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Authenticate
      const id = await verifyContactNo(values);
      await resetPass({ id, contactNo: values.contactNo });
    },
  });

  const verifyContactNo = async (payload) => {
    const { data, error } = await checkContactNo(payload);
    if (error) return openErrorDialog(error);

    return data.id;
  };

  const resetPass = async (payload) => {
    const { error } = await resetPassword(payload);
    if (error) return openErrorDialog(error);

    openResponseDialog({
      autoClose: true,
      content: `Succefully reset password. New password will be sent to ${payload.contactNo}`,
      type: "SUCCESS",
      closeCb() {
        router.push(PATHS.PUBLIC.PATIENT_SIGN_IN);
      },
    });
  };

  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ mb: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3, width: 396 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="contactNo"
                  label="Contact Number"
                  autoComplete="off"
                  value={values.contactNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.contactNo && errors.contactNo}
                  helperText={touched.contactNo && errors.contactNo}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              request password reset
            </Button>
            <Grid container>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(PATHS.PUBLIC.PATIENT_SIGN_IN);
                  }}
                >
                  Sign in to your account
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
