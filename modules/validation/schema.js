import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "First Name too long").required("Required"),
  lastName: Yup.string().max(50, "Last Name too long").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be 8 characters long") // change to 8
    .required("Required"),
});

export const SigninSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be 8 characters long") // change to 8
    .required("Required"),
});
