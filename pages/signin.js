import React, { useState } from "react";

import {
  Box,
  Button,
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
import {
  checkAccountCredentialReq,
  signInAnonymouslyReq,
} from "../modules/firebase";
import { SigninSchema } from "../modules/validation";

export default function SignInPage() {
  const router = useRouter();
  const { manualSetUser } = useAuth();

  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      contactNo: "09994441760",
      password: "12345678",
    },
    validationSchema: SigninSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      setError(null);
      const { contactNo, password } = values;

      await checkAccountCredentialReq(
        { contactNo, password },
        {
          async successCb(doc) {
            // Sign In Anonymously
            await signInAnonymouslyReq({
              successCb() {
                manualSetUser(doc);
              },
              errorCb(error) {
                setError(error);
              },
            });
          },
          errorCb(error) {
            setError(error);
          },
        }
      );
    },
  });
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  return (
    <div className="login-page">
      <Container component="main" maxWidth="xs">
        <div className="main-form">
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
                  error={(touched.contactNo && errors.contactNo) || error}
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
                  error={(touched.password && errors.password) || error}
                  helperText={(touched.password && errors.password) || error}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
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
        </div>
      </Container>
    </div>
  );
}
