import React, { useState } from "react";

import {
  Box,
  Button,
  FormHelperText,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { useAuth } from "../../contexts/AuthContext";
import { createAccountReq, signInAnonymouslyReq } from "../../modules/firebase";
import { VerificationCodeSchema } from "../../modules/validation";

export default function VerificationPage({ values: formValues }) {
  const [error, setError] = useState(null);
  const { manualSetUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
    },
    validationSchema: VerificationCodeSchema,
    validateOnChange: false,
    onSubmit: async (verificationCodes) => {
      setError(null);

      const { digit1, digit2, digit3, digit4 } = verificationCodes;
      const finalCode = `${digit1}${digit2}${digit3}${digit4}`;

      // TODO: Verify code legit
      if (finalCode === "1234") {
        // Create User Doc
        createAccountReq(formValues, {
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
        });
      } else {
        setError("Incorrect Verification code");
      }
    },
  });
  const { handleSubmit, handleChange, handleBlur, values, errors, touched } =
    formik;
  const hasFormError =
    Object.keys(errors).length > 0 && Object.keys(touched).length === 4;

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
