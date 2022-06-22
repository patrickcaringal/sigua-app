import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "First Name too long").required("Required"),
  middleName: Yup.string().max(50, "Middle Name too long"),
  lastName: Yup.string().max(50, "Last Name too long").required("Required"),
  suffix: Yup.string().max(5, "Suffix too long"),
  birthdate: Yup.string().nullable().required("Required"),
  gender: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  contactNo: Yup.string()
    .matches(/^(09)\d{9}$/, "Invalid Contact Number")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be 8 characters long") // change to 8
    .required("Required"),
});

export const VerificationCodeSchema = Yup.object().shape({
  digit1: Yup.string().required("Required"),
  digit2: Yup.string().required("Required"),
  digit3: Yup.string().required("Required"),
  digit4: Yup.string().required("Required"),
});

export const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be 8 characters long") // change to 8
    .required("Required"),
});
