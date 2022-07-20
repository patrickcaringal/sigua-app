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
import { getFullName, getUniquePersonId } from "../../../../modules/helper";
import { StaffSchema } from "../../../../modules/validation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  branches: [],
};

const defaultBranchValue = {
  name: "",
  // services: [],
  address: "",
  capacity: "",
};

export default function ManageBranchModal({
  open,
  setOpen,
  onCheckDuplicate,
  onAddStaff,
}) {
  const { openResponseDialog } = useResponseDialog();

  const formik = useFormik({
    initialValues: defaultValues,
    // validationSchema: StaffSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // const { staffs } = values;
      // const dupliNames = []; // used for error display
      // // Check Duplicates
      // const hasDuplicate = staffs.reduce((acc, i) => {
      //   const { firstName, middleName, lastName, birthdate } = i;
      //   const m = getUniquePersonId({
      //     firstName,
      //     middleName,
      //     lastName,
      //     birthdate,
      //   });
      //   const isDupli = onCheckDuplicate(m);
      //   const fullname = getFullName({
      //     firstName,
      //     middleName,
      //     lastName,
      //   });
      //   if (isDupli) dupliNames.push(fullname);
      //   return acc || isDupli;
      // }, false);
      // if (hasDuplicate) {
      //   openResponseDialog({
      //     content: (
      //       <>
      //         <Typography variant="body1">Staff already exist</Typography>
      //         <Typography variant="body2">{dupliNames.join(", ")}</Typography>
      //       </>
      //     ),
      //     type: "WARNING",
      //   });
      //   return;
      // }
      // // Add Staff
      // onAddStaff(staffs);
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
                Add Branch
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.branches.length === 0}
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
              <FieldArray
                name="branches"
                render={({ push, remove }) => (
                  <>
                    <Fab
                      color="primary"
                      sx={{ position: "absolute", bottom: 16, right: 16 }}
                      onClick={() => {
                        push(defaultBranchValue);
                      }}
                      size="small"
                    >
                      <AddIcon />
                    </Fab>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        px: 1,
                        py: 1,
                        rowGap: 3,
                        overflow: "overlay",
                        minHeight: 280,
                      }}
                    >
                      {values.branches.map((s, index) => {
                        const branchValue = values.branches[index];
                        const branchTouched = touched.branches?.[index];
                        const branchErrors = errors.branches?.[index];
                        const getError = (field) =>
                          branchTouched?.[field] && branchErrors?.[field];

                        return (
                          <Card key={index} elevation={2}>
                            <CardHeader
                              avatar={
                                <Avatar sx={{ bgcolor: "primary.main" }}>
                                  {index + 1}
                                </Avatar>
                              }
                              action={
                                <>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      remove(index);
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </>
                              }
                              title={`Branch ${index + 1}`}
                            />
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={8}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Branch Name"
                                    name={`branches[${index}].name`}
                                    autoComplete="off"
                                    value={branchValue.name}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `branches[${index}].name`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("name")}
                                    helperText={getError("name")}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Capacity"
                                    name={`branches[${index}].capacity`}
                                    autoComplete="off"
                                    value={branchValue.capacity}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `branches[${index}].capacity`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("capacity")}
                                    helperText={getError("capacity")}
                                  />
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Address"
                                    name={`branches[${index}].address`}
                                    autoComplete="off"
                                    value={branchValue.address}
                                    onChange={(e) =>
                                      setFieldValue(
                                        `branches[${index}].address`,
                                        e.target.value.toUpperCase()
                                      )
                                    }
                                    onBlur={handleBlur}
                                    error={getError("address")}
                                    helperText={getError("address")}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Box>
                  </>
                )}
              />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Dialog>
  );
}
