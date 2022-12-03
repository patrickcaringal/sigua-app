import React, { useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

import { formatTimeStamp } from "../../../../modules/helper";
import { DatePicker, Input, PasswordInput, Select } from "../../../common/Form";
import TermsDialog from "./TermsDialog";

const Form = ({
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  values,
  errors,
  touched,
}) => {
  const [termsOpen, setTermsOpen] = useState(false);
  const router = useRouter();
  const getError = (field) => touched?.[field] && errors?.[field];

  return (
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
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                if (!value || value == "Invalid Date") return;
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
              <InfoIcon fontSize="small" sx={{ mr: 1 }} /> Contact Number will
              be used for Signing in
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
            <PasswordInput
              required
              name="password"
              label="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError("password")}
            />
          </Grid>
          <Grid item xs={12}>
            <PasswordInput
              required
              name="matchPassword"
              label="Confirm Password"
              value={values.matchPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError("matchPassword")}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              name="termsAgree"
              checked={!!values.termsAgree}
              onChange={handleChange}
              onBlur={handleBlur}
              control={<Checkbox />}
              label={
                <Typography variant="caption">
                  Agree to our &nbsp;
                  <Link
                    href="#"
                    fontWeight="bold"
                    sx={{ textDecoration: "none" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setTermsOpen(true);
                    }}
                  >
                    Terms and Conditions
                  </Link>
                </Typography>
              }
            />
            {!!getError("termsAgree") && (
              <FormHelperText error>{getError("termsAgree")} </FormHelperText>
            )}
          </Grid>
        </Grid>
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
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

      <TermsDialog
        open={termsOpen}
        onAccept={() => {
          setFieldValue("termsAgree", true, true);
          // setFieldTouched("termsAgree", true, false);
          setTermsOpen(false);
        }}
        onClose={() => setTermsOpen(false)}
      />
    </Box>
  );
};

export default Form;
