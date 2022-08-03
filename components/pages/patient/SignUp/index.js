import React, { useState } from "react";

import { Box, Container } from "@mui/material";
import faker from "faker";
import { useFormik } from "formik";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  checkAccountDuplicateReq,
  createAccountReq,
  signInAnonymouslyReq,
} from "../../../../modules/firebase";
import { SignupSchema } from "../../../../modules/validation";
import { MobileNumberVerificationModal } from "../../../shared";
import Form from "./Form";

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

const defaultModal = {
  open: false,
  data: {},
};

const SignUpPage = () => {
  const { manualSetUser } = useAuth();
  const { openErrorDialog } = useResponseDialog();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [checkAccountDuplicate] = useRequest(
    checkAccountDuplicateReq,
    setBackdropLoader
  );
  const [createAccount] = useRequest(createAccountReq);
  const [signInAnonymously] = useRequest(signInAnonymouslyReq);

  // Local States
  const [phoneModal, setPhoneModal] = useState(defaultModal); // Phone Verification Modal

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

      //   // Move to contact no verification
      //   setStep(STEPS.VERIFICATION);
      handlePhoneModalOpen(values);
    },
  });
  const { values } = formik;

  const handleVerifyPhone = async (member) => {
    const { code } = member;

    // TODO: Verify code legit
    if (code === "1234") {
      setBackdropLoader(true);

      // Create User Doc
      const { data: userInfo, error: createAccError } = await createAccount(
        values
      );
      if (createAccError) {
        setBackdropLoader(false);
        return openErrorDialog(createAccError);
      }

      const { error: signInError } = await signInAnonymously();
      if (signInError) {
        setBackdropLoader(false);
        return openErrorDialog(signInError);
      }

      setBackdropLoader(false);
      manualSetUser(userInfo);
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
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Form {...formik} />
        {phoneModal.open && (
          <MobileNumberVerificationModal
            open={phoneModal.open}
            data={phoneModal.data}
            onClose={handlePhoneModalClose}
            onVerify={handleVerifyPhone}
          />
        )}
      </Container>
    </Box>
  );
};
export default SignUpPage;
