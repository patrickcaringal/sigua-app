import React, { useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import { LoadingButton } from "@mui/lab";
import {
  Box,
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
// import Select from "@mui/material/Select";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import faker from "faker";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import { checkAccountDuplicateReq } from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { SignupSchema } from "../../../../modules/validation";
import { DatePicker, Input, Select } from "../../../common/Form";
import VerificationPage from "./VerificationPage";

const STEPS = {
  DETAILS: "details",
  VERIFICATION: "verification",
};

const defaultValue = isMockDataEnabled
  ? {
      firstName: faker.name.firstName(),
      suffix: "",
      lastName: faker.name.lastName(),
      middleName: faker.name.lastName(),
      email: faker.internet.email(),
      address: faker.lorem.paragraph(1),
      birthdate: faker.date.past(
        faker.datatype.number({
          min: 10,
          max: 50,
        })
      ),
      gender: faker.random.arrayElement(["male", "female"]),
      contactNo: faker.phone.phoneNumber("09#########"),
      password: "12345678",
    }
  : {
      firstName: "",
      middleName: "",
      lastName: "",
      suffix: "",
      birthdate: "",
      gender: "",
      address: "",
      contactNo: "",
      password: "",
    };

const SignUpPage = () => {
  const router = useRouter();
  const { openErrorDialog } = useResponseDialog();
  const [checkAccountDuplicate, checkAccountDuplicateLoading] = useRequest(
    checkAccountDuplicateReq
  );

  const [step, setStep] = useState(STEPS.DETAILS);

  const formik = useFormik({
    initialValues: defaultValue,
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Check Account Duplicate
      const { error: checkAccDupliError } = await checkAccountDuplicate(
        values.contactNo
      );
      if (checkAccDupliError) return openErrorDialog(checkAccDupliError);

      // Move to contact no verification
      setStep(STEPS.VERIFICATION);
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

  const getError = (field) => touched?.[field] && errors?.[field];

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        {step === STEPS.DETAILS ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                  <Input
                    required
                    label="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={(e) =>
                      setFieldValue("firstName", e.target.value.toUpperCase())
                    }
                    onBlur={handleBlur}
                    error={getError("firstName")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Input
                    required
                    label="Middle Name"
                    name="middleName"
                    value={values.middleName}
                    onChange={(e) =>
                      setFieldValue("middleName", e.target.value.toUpperCase())
                    }
                    onBlur={handleBlur}
                    error={getError("middleName")}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Input
                    required
                    label="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={(e) =>
                      setFieldValue("lastName", e.target.value.toUpperCase())
                    }
                    onBlur={handleBlur}
                    error={getError("lastName")}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Input
                    label="Suffix"
                    name="suffix"
                    value={values.suffix}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    value={values.birthdate}
                    required
                    label="Date of Birth"
                    name="birthdate"
                    onChange={(value) => {
                      setFieldValue("birthdate", formatTimeStamp(value), false);
                    }}
                    onBlur={handleBlur}
                    error={getError("birthdate")}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    required
                    label="Gender"
                    value={values.gender}
                    onChange={(e) => {
                      setFieldValue("gender", e.target.value, false);
                    }}
                    onBlur={handleBlur}
                    error={getError("gender")}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <Input
                    required
                    label="Full Address"
                    name="address"
                    value={values.address}
                    onChange={(e) =>
                      setFieldValue("address", e.target.value.toUpperCase())
                    }
                    onBlur={handleBlur}
                    error={getError("address")}
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
                    <InfoIcon fontSize="small" sx={{ mr: 1 }} /> Contact Number
                    will be used for Signing in
                  </FormHelperText>
                  <Input
                    required
                    label="Contact Number"
                    name="contactNo"
                    value={values.contactNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={getError("contactNo")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Input
                    required
                    name="password"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={getError("password")}
                  />
                </Grid>
              </Grid>
              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                loading={checkAccountDuplicateLoading}
              >
                Sign Up
              </LoadingButton>
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
          </Box>
        ) : (
          <VerificationPage values={values} />
        )}
      </Container>
    </Box>
  );
};
export default SignUpPage;
