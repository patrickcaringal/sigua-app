import React from "react";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { Input, PasswordInput } from "../../../../components/common";
import { useAuth } from "../../../../contexts/AuthContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  saveLogReq,
  signInReq,
} from "../../../../modules/firebase";
import { DoctorSigninSchema } from "../../../../modules/validation";

const defaultValues = {
  email: "",
  password: "",
};

const DoctorSignInPage = () => {
  const { user, manualSetUser } = useAuth();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [signIn, isSignInLoading] = useRequest(signInReq);

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: DoctorSigninSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { email, password } = values;
      // Authenticate
      const { data: userInfo, error: authError } = await signIn({
        email,
        password,
      });
      if (authError) return openErrorDialog(authError);

      await saveLogReq({
        actorId: userInfo.id,
        actorName: userInfo.name,
        action: LOG_ACTIONS.LOGIN,
        resourceType: RESOURCE_TYPE.DOCTOR,
        resourceId: null,
        resourceName: null,
        change: null,
      });

      manualSetUser(userInfo);
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
      <Container component="main" maxWidth="xs" sx={{ mb: 10 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Doctor Sign In
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  name="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <PasswordInput
                  name="password"
                  label="Password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  helperText={touched.password && errors.password}
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
            </Grid>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default DoctorSignInPage;
