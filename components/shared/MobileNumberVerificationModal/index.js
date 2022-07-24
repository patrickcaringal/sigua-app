import React from "react";

import { LoadingButton } from "@mui/lab";
import {
  AppBar,
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";

import { VerificationCodeSchema } from "../../../modules/validation";
import { Modal } from "../../common";

const MobileNumberVerificationModal = ({ open, onClose }) => {
  const formik = useFormik({
    initialValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
    },
    validationSchema: VerificationCodeSchema,
    validateOnChange: false,
    onSubmit: async (verificationCodes) => {},
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    resetForm,
  } = formik;
  const hasFormError =
    Object.keys(errors).length > 0 && Object.keys(touched).length === 4;

  const handleSendVeridication = () => {};

  const handleClose = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ overflow: "overlay" }}
      >
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Mobile # Verification
              </Typography>

              <Button color="inherit" sx={{ mr: 2 }} type="submit">
                verify
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 10,
            py: 6,
          }}
        >
          <Typography variant="h5">Verification code sent to</Typography>
          <Typography variant="h6">09994441760</Typography>

          <Box
            sx={{
              mt: 5,
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
                error={hasFormError}
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
                error={hasFormError}
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
                error={hasFormError}
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
                error={hasFormError}
              />
            </Grid>
          </Box>
          {hasFormError && (
            <FormHelperText error sx={{ mt: 2 }}>
              Complete the verification code
            </FormHelperText>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default MobileNumberVerificationModal;
