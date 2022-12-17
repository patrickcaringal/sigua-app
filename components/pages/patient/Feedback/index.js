import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { addFeedbackReq } from "../../../../modules/firebase";
import { FeedbackSchema } from "../../../../modules/validation";
import { Input, PATHS, Toolbar, successMessage } from "../../../common";

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [addFeedback] = useRequest(addFeedbackReq, setBackdropLoader);

  // Local States
  const formik = useFormik({
    initialValues: {
      feedback: "",
      rating: 5,
    },
    validationSchema: FeedbackSchema,
    validateOnChange: false,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        ...values,
        accountId: user.id,
        accountName: user.name,
      };

      const { error } = await addFeedback(payload);
      if (error) return openErrorDialog(error);

      resetForm();
      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Feedback",
          verb: "submitted",
        }),
        type: "SUCCESS",
      });
    },
  });

  return (
    <Container maxWidth="lg">
      <Toolbar
        onRootClick={() => router.push(PATHS.PATIENT.DASHBOARD)}
        paths={[{ text: "Feedback" }]}
      />
      <Paper
        sx={{
          minHeight: "calc(100vh - 64px - 64px - 30px )",
          // display: "grid",
          // gridTemplateColumns: "215px auto",
          // gridTemplateRows: "calc(100vh - 144px) auto",
          // columnGap: 3,
          p: 3,
        }}
      >
        <Typography sx={{ pb: 2 }}>
          We would love to hear your thoughts on Sigua Medical Clinic
        </Typography>
        <Input
          multiline
          rows={5}
          placeholder="Describe your feedback"
          required
          name="feedback"
          value={formik.values.feedback}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.feedback && formik.errors.feedback}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography sx={{ mr: 2 }}>Rating</Typography>
          <Rating
            size="large"
            name="simple-controlled"
            value={formik.values.rating}
            onChange={(event, newValue) => {
              formik.setFieldValue("rating", newValue);
            }}
          />
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={formik.submitForm}
          sx={{ mt: 3 }}
        >
          submit feedback
        </Button>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
