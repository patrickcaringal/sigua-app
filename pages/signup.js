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
import { useFormik } from "formik";
import { useRouter } from "next/router";

import { useAuth } from "../contexts/AuthContext";
import { SignupSchema } from "../modules/validation";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      setError(null);

      await signUp(values, {
        successCb() {
          router.push("/dashboard");
        },
        errorCb(error) {
          setError(error);
        },
      });
    },
  });
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;

  return (
    <div className="patient-signup-page">
      <Container component="main" maxWidth="xs">
        <div className="main-form">
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  autoComplete="off"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.firstName && errors.firstName) || error}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  autoComplete="off"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.lastName && errors.lastName) || error}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={(touched.email && errors.email) || error}
                  helperText={touched.email && errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
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
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link
                  href="#"
                  variant="body2"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/signin");
                  }}
                >
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </div>
      </Container>
    </div>
  );
}
