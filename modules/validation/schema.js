import { differenceInYears } from "date-fns";
import * as Yup from "yup";

export const SignupSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "First Name too long").required("Required"),
  middleName: Yup.string().max(50, "Middle Name too long"),
  lastName: Yup.string().max(50, "Last Name too long").required("Required"),
  suffix: Yup.string().max(5, "Suffix too long"),
  birthdate: Yup.string()
    .nullable()
    .required("Required")
    .test(
      "birthdate",
      "Age 13 below is not allowed for account registration",
      (value) => differenceInYears(new Date(), new Date(value)) >= 13
    ),
  gender: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  contactNo: Yup.string()
    .matches(/^(09)\d{9}$/, "Invalid Contact Number")
    .required("Required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must Contain 8 Characters (atleast 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character)"
    )
    .required("Required"),
  matchPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  termsAgree: Yup.boolean().oneOf([true], "Must Accept Terms and Conditions"),
});

export const UpdateProfileSchema = Yup.object().shape({
  firstName: Yup.string().max(50, "First Name too long").required("Required"),
  middleName: Yup.string().max(50, "Middle Name too long"),
  lastName: Yup.string().max(50, "Last Name too long").required("Required"),
  suffix: Yup.string().max(5, "Suffix too long"),
  birthdate: Yup.string().nullable().required("Required"),
  gender: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
});

export const FeedbackSchema = Yup.object().shape({
  feedback: Yup.string().max(500, "Feedback too long").required("Required"),
});

export const ChangePassSchema = Yup.object().shape({
  password: Yup.string().required("Required"),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must Contain 8 Characters (atleast 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Case Character)"
    )
    .required("Required"),
  matchPassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
});

export const VerificationCodeSchema = Yup.object().shape({
  digit1: Yup.number().required("Required"),
  digit2: Yup.number().required("Required"),
  digit3: Yup.number().required("Required"),
  digit4: Yup.number().required("Required"),
});

export const SigninSchema = Yup.object().shape({
  contactNo: Yup.string()
    .matches(/^(09)\d{9}$/, "Invalid Contact Number")
    .required("Required"),
  password: Yup.string().required("Required"),
});

export const PatientForgotPasswordSchema = Yup.object().shape({
  contactNo: Yup.string()
    .matches(/^(09)\d{9}$/, "Invalid Contact Number")
    .required("Required"),
});

export const DoctorSigninSchema = Yup.object().shape({
  email: Yup.string().email().required("Required"),
  password: Yup.string().required("Required"),
});

export const FamilyMemberSchema = Yup.object().shape({
  familyMembers: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string()
        .max(50, "First Name too long")
        .required("Required"),
      middleName: Yup.string().max(50, "Middle Name too long"),
      lastName: Yup.string().max(50, "Last Name too long").required("Required"),
      suffix: Yup.string().max(5, "Suffix too long"),
      birthdate: Yup.string().nullable().required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      contactNo: Yup.string()
        .matches(/^(09)\d{9}$/, "Invalid Contact Number")
        .required("Required"),
    })
  ),
});

export const StaffSchema = Yup.object().shape({
  staffs: Yup.array().of(
    Yup.object().shape({
      firstName: Yup.string()
        .max(50, "First Name too long")
        .required("Required"),
      middleName: Yup.string().max(50, "Middle Name too long"),
      lastName: Yup.string().max(50, "Last Name too long").required("Required"),
      suffix: Yup.string().max(5, "Suffix too long"),
      birthdate: Yup.string().nullable().required("Required"),
      gender: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      email: Yup.string().email().required("Required"),
      branch: Yup.string().required("Required"),
    })
  ),
});

export const ServicesSchema = Yup.object().shape({
  services: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(50, "Service name too long").required("Required"),
      description: Yup.string()
        .max(250, "Description too long")
        .required("Required"),
    })
  ),
});

export const BranchesSchema = Yup.object().shape({
  branches: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().max(50, "Branch name too long").required("Required"),
      services: Yup.array().min(1, "Required"),
      capacity: Yup.number()
        .required("Required")
        .test("Is positive?", "Positive number only", (value) => value >= 0),
      address: Yup.string()
        .max(250, "Description too long")
        .required("Required"),
    })
  ),
});

export const VerificationRejectSchema = Yup.object().shape({
  verificationRejectReason: Yup.string()
    .required("Required")
    .max(250, "Reason too long"),
});

export const QueueSchema = Yup.object().shape({
  date: Yup.string().nullable().required("Required"),
  branchId: Yup.string().required("Required"),
  capacity: Yup.number()
    .required("Required")
    .test("Is positive?", "Positive number only", (value) => value >= 0),
});

export const RegisterForQueueSchema = Yup.object().shape({
  serviceId: Yup.string().required("Required"),
  patientId: Yup.string().required("Required"),
  patientNote: Yup.string().max(250, "Note").required("Required"),
});

export const DiagnoseSchema = Yup.object().shape({
  diagnosis: Yup.string().required("Required").max(500, "Diagnosis too long"),
});

export const VitalSignsSchema = Yup.object().shape({
  bodyTemperature: Yup.string().required("Required"),
  pulseRate: Yup.string().required("Required"),
  bloodPressure: Yup.string().required("Required"),
  height: Yup.string().required("Required"),
  weight: Yup.string().required("Required"),
});
