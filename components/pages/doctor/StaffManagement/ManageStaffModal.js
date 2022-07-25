import React from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { FieldArray, FormikProvider, useFormik } from "formik";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { StaffSchema } from "../../../../modules/validation";
import Form from "./Form";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  staffs: [],
};

// {
//   staffs: [
//     {
//       firstName: "KIM",
//       middleName: "SOYA",
//       lastName: "JISOO",
//       suffix: "",
//       birthdate: "1997-07-10T13:52:43.000Z",
//       gender: "female",
//       address:
//         "BLK 12 LOT 19 DON ONOFRE VILLAGE, BRGY. BANAY-BANAY, CABUYAO CITY, LAGUNA",
//       email: "soya@gmail.com",
//       branch: "LAKESIDE",
//     },
//     {
//       firstName: "KIM",
//       middleName: "SOYA",
//       lastName: "JISOO",
//       suffix: "",
//       birthdate: "1997-07-11T13:52:43.000Z",
//       gender: "female",
//       address:
//         "BLK 12 LOT 19 DON ONOFRE VILLAGE, BRGY. BANAY-BANAY, CABUYAO CITY, LAGUNA",
//       email: "soya2@gmail.com",
//       branch: "LAKESIDE",
//     },
//   ],
// }

const defaultStaffValue = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthdate: "",
  gender: "",
  address: "",
  email: "",
  branch: "",
};

export default function ManageStaffModal({ open, setOpen, onAddStaff }) {
  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: StaffSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { staffs } = values;
      // Add Staff
      onAddStaff(staffs);
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    setFieldValue,
    values,
    errors,
    touched,
    resetForm,
  } = formik;

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
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
                Add Staff
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.staffs.length === 0}
              >
                save
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2 }}>
          <FormikProvider value={formik}>
            <Container maxWidth="lg">
              <Form {...formik} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Dialog>
  );
}
