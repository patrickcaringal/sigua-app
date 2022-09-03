import React from "react";

import InfoIcon from "@mui/icons-material/Info";
import { LoadingButton } from "@mui/lab";
import { Box, FormHelperText, Grid, Link, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/router";

import { formatTimeStamp } from "../../../../modules/helper";
import { DatePicker, Input, Select } from "../../../common/Form";

const Form = ({
  handleSubmit,
  handleChange,
  handleBlur,
  setFieldValue,
  values,
  errors,
  touched,
}) => {
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
  );
};

export default Form;
