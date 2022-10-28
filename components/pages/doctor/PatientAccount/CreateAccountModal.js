import React, { useState } from "react";

import InfoIcon from "@mui/icons-material/Info";
import {
  AppBar,
  Box,
  Button,
  Container,
  FormHelperText,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import faker from "faker";
import { useFormik } from "formik";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  LOG_ACTIONS,
  REG_TYPE,
  RESOURCE_TYPE,
  checkAccountDuplicateReq,
  createAccountReq,
  saveLogReq,
} from "../../../../modules/firebase";
import { formatTimeStamp, getUniquePersonId } from "../../../../modules/helper";
import { Modal, successMessage } from "../../../common";
import { DatePicker, Input, Select } from "../../../common/Form";
import { MobileNumberVerificationModal } from "../../../shared";

const defaultValue = isMockDataEnabled
  ? {
      firstName: faker.name.firstName().toUpperCase(),
      suffix: "",
      lastName: faker.name.lastName().toUpperCase(),
      middleName: faker.name.lastName().toUpperCase(),
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

const defaultModal = {
  open: false,
  data: {},
};

const CreateAccountModal = ({ open = false, onCreate, onClose }) => {
  const { user } = useAuth();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [checkAccountDuplicate] = useRequest(
    checkAccountDuplicateReq,
    setBackdropLoader
  );
  const [createAccount] = useRequest(createAccountReq);

  // Local States
  const [phoneModal, setPhoneModal] = useState(defaultModal); // Phone Verification Modal

  const formik = useFormik({
    initialValues: defaultValue,
    // validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const contactNo = values.contactNo || null;
      // Check Account Duplicate
      const { error: checkAccDupliError } = await checkAccountDuplicate({
        contactNo,
        name: getUniquePersonId(values),
      });
      if (checkAccDupliError) return openErrorDialog(checkAccDupliError);

      if (contactNo) {
        handlePhoneModalOpen(values);
      } else {
        createAccountFn();
      }
    },
  });
  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    values,
    errors,
    touched,
  } = formik;

  const getError = (field) => touched?.[field] && errors?.[field];

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const createAccountFn = async () => {
    setBackdropLoader(true);

    // Create User Doc
    const payload = {
      ...values,
      password: "12345678",
      registrationType: REG_TYPE.STAFF_REGISTERED,
    };
    const { data: userInfo, error: createAccError } = await createAccount(
      payload
    );
    if (createAccError) {
      setBackdropLoader(false);
      return openErrorDialog(createAccError);
    }

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.CREATE,
      resourceType: RESOURCE_TYPE.PATIENT,
      resourceId: userInfo.id,
      resourceName: userInfo.name,
      change: null,
    });

    setBackdropLoader(false);
    onCreate([{ ...userInfo, familyMembers: 1 }]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Account",
        verb: "created",
      }),
      type: "SUCCESS",
      closeCb() {
        handleClose();
      },
    });
  };

  const handleVerifyPhone = async (verified) => {
    if (verified) {
      await createAccountFn();
    } else {
      openErrorDialog("Incorrect Verification code");
    }
  };

  const handlePhoneModalOpen = (data) => {
    setPhoneModal({
      open: true,
      data,
    });
  };

  const handlePhoneModalClose = () => {
    setPhoneModal(defaultModal);
  };

  return (
    <>
      <Modal open={open && !phoneModal.open} onClose={handleClose}>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AppBar sx={{ position: "sticky" }}>
            <Container maxWidth="lg">
              <Toolbar disableGutters>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Create Account
                </Typography>

                <Button
                  color="inherit"
                  sx={{ mr: 2 }}
                  type="submit"
                  // disabled={!dirty}
                >
                  save
                </Button>
                <Button color="inherit" onClick={handleClose}>
                  Cancel
                </Button>
              </Toolbar>
            </Container>
          </AppBar>

          <Box sx={{ py: 4, px: 1 }}>
            <Container maxWidth="lg">
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
                    <InfoIcon fontSize="small" sx={{ mr: 1 }} /> Contact Number
                    will be used for Signing in. Default password will be
                    12345678
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
              </Grid>
            </Container>
          </Box>
        </Box>
      </Modal>
      {phoneModal.open && (
        <MobileNumberVerificationModal
          open={phoneModal.open}
          data={phoneModal.data}
          onClose={handlePhoneModalClose}
          onVerify={handleVerifyPhone}
        />
      )}
    </>
  );
};

export default CreateAccountModal;
