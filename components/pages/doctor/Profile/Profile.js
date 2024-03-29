import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  saveLogReq,
  updateDoctorReq,
  updateStaffReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
} from "../../../../modules/helper";
import { UpdateProfileSchema } from "../../../../modules/validation";
import { successMessage } from "../../../common";
import { DatePicker, Input, Select } from "../../../common/Form";

const ProfilePage = ({ data, onSave, mode = "doctor" }) => {
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const isDoctor = mode === "doctor";

  // Requests
  const [updateProfile] = useRequest(
    isDoctor ? updateDoctorReq : updateStaffReq,
    setBackdropLoader
  );

  const formik = useFormik({
    initialValues: { ...data },
    validationSchema: UpdateProfileSchema,
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      const oldCopy = [data];
      values = {
        ...values,
        birthdate: formatTimeStamp(values.birthdate),
      };

      const updatedDoc = {
        ...values,
        ...personBuiltInFields(values),
      };

      const { updates } = localUpdateDocs({
        updatedDoc,
        oldDocs: oldCopy,
      });

      // Update
      const payload = { [isDoctor ? "doctor" : "staff"]: updates };
      const { error } = await updateProfile(payload);
      if (error) return openErrorDialog(error);

      // savelog
      await saveLogReq({
        actorId: user.id,
        actorName: user.name,
        action: LOG_ACTIONS.UPDATE,
        resourceType: RESOURCE_TYPE.PROFILE,
        resourceId: null,
        resourceName: null,
        change: null,
      });

      // Successful
      onSave(updates);
      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Profile",
          verb: "updated",
        }),
        type: "SUCCESS",
      });
    },
  });

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    setFieldValue,
    submitForm,
  } = formik;
  const getError = (field) => touched?.[field] && errors?.[field];

  if (!Object.keys(values).length) return null;

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" sx={{ mb: 4 }} fontWeight="bold">
        Profile
      </Typography>
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
            value={formatTimeStamp(values.birthdate)}
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
      </Grid>

      <Button
        variant="contained"
        size="small"
        onClick={submitForm}
        sx={{ mt: 3 }}
      >
        save changes
      </Button>
    </Container>
  );
};

export default ProfilePage;
