import React, { useEffect } from "react";

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
import { getFullName, getUniquePersonId } from "../../../../modules/helper";
import { BranchesSchema } from "../../../../modules/validation";
import Form from "./Form";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  branches: [],
};

const defaultBranchValue = {
  name: "",
  services: [],
  address: "",
  capacity: "",
};

export default function ManageBranchModal({
  open = false,
  data,
  onClose,
  onSave,
  services,
}) {
  const servicesMap = services.reduce((acc, i) => {
    return { ...acc, [i.name]: i.id };
  }, {});

  const isCreate = !data;
  const initialValues = isCreate ? defaultValues : { branches: [data] };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: BranchesSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const { branches } = values;

      const mappedBranches = branches.map((i) => ({
        ...i,
        services: i.services.map((j) => ({
          id: servicesMap[j],
          name: j,
        })),
      }));

      onSave(mappedBranches);
    },
  });

  const { handleSubmit, values, dirty, resetForm } = formik;

  useEffect(() => {
    if (!open) resetForm();
  }, [open, resetForm]);

  const handleClose = () => {
    onClose();
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
                {isCreate ? "Add" : "Edit"} Branch
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.branches.length === 0 || !dirty}
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
              <Form {...formik} isCreate={isCreate} services={services} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Dialog>
  );
}
