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
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import { useAuth } from "../../contexts/AuthContext";
import { VerificationCodeSchema } from "../../modules/validation";

export default function VerificationPage({ values: formValues }) {
  const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
    },
    validationSchema: VerificationCodeSchema,
    validateOnChange: false,
    onSubmit: async (verificationCode) => {
      const { digit1, digit2, digit3, digit4 } = verificationCode;
      console.log(digit1, digit2, digit3, digit4);
      console.log(JSON.stringify(formValues, null, 4));
      // setError(null);
      // await signUp(values, {
      //   successCb() {
      //     router.push("/dashboard");
      //   },
      //   errorCb(error) {
      //     setError(error);
      //   },
      // });
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
  const hasFormError = !!Object.keys(errors).length;

  console.log(errors);

  return (
    <div className="verification-form">
      <Typography component="h1" variant="h5">
        Contact Number Verification
      </Typography>
      <Typography variant="body1">
        Verification code sent to {formValues.contactNo}
      </Typography>

      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit1"
              autoComplete="off"
              value={values.digit1}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError || error}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit2"
              autoComplete="off"
              value={values.digit2}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError || error}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit3"
              autoComplete="off"
              value={values.digit3}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError || error}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              inputProps={{ min: 0, style: { textAlign: "center" } }}
              name="digit4"
              autoComplete="off"
              value={values.digit4}
              onChange={handleChange}
              onBlur={handleBlur}
              error={hasFormError || error}
            />
          </Grid>
        </Box>

        {(hasFormError || error) && (
          <FormHelperText error sx={{ mt: 2 }}>
            {hasFormError ? "Complete the verification code" : error}
          </FormHelperText>
        )}

        <Button type="submit" variant="contained" sx={{ mt: 3 }}>
          Verify
        </Button>
      </Box>
    </div>
  );
}
