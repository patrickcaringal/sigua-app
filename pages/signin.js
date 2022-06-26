import React, { useState } from "react";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";
import { useResponseDialog } from "../contexts/ResponseDialogContext";
import useRequest from "../hooks/useRequest";
import {
  checkAccountCredentialReq,
  signInAnonymouslyReq,
} from "../modules/firebase";
import { SigninSchema } from "../modules/validation";

export default function SignInPage() {
  const router = useRouter();
  const { manualSetUser } = useAuth();
  const { openResponseDialog } = useResponseDialog();
  const [checkAccountCredential, checkAccountCredentialLoading] = useRequest(
    checkAccountCredentialReq
  );
  const [signInAnonymously, signInAnonymouslyLoading] =
    useRequest(signInAnonymouslyReq);
  const isSignInLoading =
    checkAccountCredentialLoading || signInAnonymouslyLoading;

  const formik = useFormik({
    initialValues: {
      contactNo: "09994441760",
      password: "12345678",
    },
    validationSchema: SigninSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { contactNo, password } = values;

      checkAccountCredential(
        { contactNo, password },
        {
          async successCb(doc) {
            // Sign In Anonymously
            signInAnonymously({
              successCb() {
                manualSetUser(doc);
              },
              errorCb(error) {
                openResponseDialog({
                  content: error,
                  type: "ERROR",
                });
              },
            });
          },
          errorCb(error) {
            openResponseDialog({
              content: error,
              type: "ERROR",
            });
          },
        }
      );
    },
  });
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
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          mb: 10,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Patient Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
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
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="off"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
            </Grid>
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              loading={isSignInLoading}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/signup");
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
