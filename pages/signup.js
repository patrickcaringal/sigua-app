import React, { useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import {
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import VerificationPage from "../components/views/verification";
import { useAuth } from "../contexts/AuthContext";
import { checkAccountDuplicateReq } from "../modules/firebase";
import { SignupSchema } from "../modules/validation";

const STEPS = {
  DETAILS: "details",
  VERIFICATION: "verification",
};

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [error, setError] = useState(null);
  const [step, setStep] = useState(STEPS.DETAILS);

  const formik = useFormik({
    // initialValues: {
    //   firstName: "",
    //   middleName: "",
    //   lastName: "",
    //   suffix: "",
    //   birthdate: "",
    //   gender: "",
    //   address: "",
    //   contactNo: "",
    //   password: "",
    // },
    initialValues: {
      firstName: "pat",
      middleName: "punsalang",
      lastName: "caringal",
      suffix: "",
      birthdate: "1997-07-10",
      gender: "male",
      address: "dov",
      contactNo: "09994441760",
      password: "12345678",
    },
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      setError(null);

      // Check Account Duplication
      checkAccountDuplicateReq(values.contactNo, {
        successCb() {
          setStep(STEPS.VERIFICATION);
          // TODO: Send verification here
        },
        errorCb(error) {
          setError(error);
        },
      });
    },
  });
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    errors,
    touched,
  } = formik;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="patient-signup-page">
        <Container component="main" maxWidth="xs">
          {step === STEPS.DETAILS ? (
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
                      size="small"
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
                      size="small"
                      required
                      fullWidth
                      label="Middle Name"
                      name="middleName"
                      autoComplete="off"
                      value={values.middleName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={(touched.middleName && errors.middleName) || error}
                      helperText={touched.middleName && errors.middleName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      size="small"
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      size="small"
                      fullWidth
                      label="Suffix"
                      name="suffix"
                      autoComplete="off"
                      value={values.suffix}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={error}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MobileDatePicker
                      label="Date of Birth"
                      inputFormat="MM/dd/yyyy"
                      value={values.birthdate}
                      onChange={(value) => {
                        setFieldValue("birthdate", value, false);
                      }}
                      onBlur={handleBlur}
                      renderInput={(params) => {
                        return (
                          <TextField
                            size="small"
                            {...params}
                            required
                            fullWidth
                            name="birthdate"
                            error={
                              (touched.birthdate && errors.birthdate) || error
                            }
                            helperText={touched.birthdate && errors.birthdate}
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl
                      fullWidth
                      size="small"
                      required
                      error={(touched.gender && errors.gender) || error}
                    >
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={values.gender}
                        label="Gender"
                        onChange={(e) => {
                          setFieldValue("gender", e.target.value, false);
                        }}
                        onBlur={handleBlur}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                      </Select>
                      {touched.gender && errors.gender && (
                        <FormHelperText>{errors.gender}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      size="small"
                      required
                      fullWidth
                      label="Full Address"
                      name="address"
                      autoComplete="off"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={(touched.address && errors.address) || error}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>

                  {/* CREDENTIAL */}
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <FormHelperText
                      sx={{ mb: 2 }}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <InfoIcon fontSize="small" sx={{ mr: 1 }} /> Contact
                      Number will be used for Signing in
                    </FormHelperText>
                    <TextField
                      size="small"
                      required
                      fullWidth
                      label="Contact Number"
                      name="contactNo"
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
                      size="small"
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
                      helperText={
                        (touched.password && errors.password) || error
                      }
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
          ) : (
            <VerificationPage values={values} />
          )}
        </Container>
      </div>
    </LocalizationProvider>
  );
}
