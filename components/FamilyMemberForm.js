import React, { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
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

import { FamilyMemberSchema } from "../modules/validation";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog({ open, setOpen }) {
  // const [error, setError] = useState(null);

  const formik = useFormik({
    initialValues: {
      familyMembers: [],
    },
    validationSchema: FamilyMemberSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log("submit");
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
  } = formik;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Box component="form" noValidate onSubmit={handleSubmit}>
        <AppBar sx={{ position: "relative" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Family Member
              </Typography>

              <Button color="inherit" sx={{ mr: 2 }} type="submit">
                save
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box>
          <FormikProvider value={formik}>
            <Container maxWidth="lg">
              <FieldArray
                name="familyMembers"
                render={({ push, remove }) => (
                  <>
                    <Toolbar disableGutters sx={{ justifyContent: "flex-end" }}>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        size="small"
                        onClick={() => {
                          push({
                            firstName: "",
                            middleName: "",
                            lastName: "",
                            suffix: "",
                            birthdate: "",
                            gender: "",
                            address: "",
                          });
                        }}
                      >
                        add family member
                      </Button>
                    </Toolbar>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        px: 1,
                        py: 1,
                        rowGap: 3,
                        overflow: "overlay",
                      }}
                    >
                      {formik.values.familyMembers.map((member, index) => {
                        const famMemberValue = values.familyMembers[index];
                        const famMemberTouched = touched.familyMembers?.[index];
                        const famMemberErrors = errors.familyMembers?.[index];

                        return (
                          <Card key={index} elevation={2}>
                            <CardHeader
                              avatar={
                                <Avatar
                                  sx={{ bgcolor: "primary.main" }}
                                  aria-label="recipe"
                                >
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
                              title={`Family Member ${index + 1}`}
                            />
                            <CardContent>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="First Name"
                                    name={`familyMembers[${index}].firstName`}
                                    autoComplete="off"
                                    value={famMemberValue.firstName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      famMemberTouched?.firstName &&
                                      famMemberErrors?.firstName
                                    }
                                    helperText={
                                      famMemberTouched?.firstName &&
                                      famMemberErrors?.firstName
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Middle Name"
                                    name={`familyMembers[${index}].middleName`}
                                    autoComplete="off"
                                    value={famMemberValue.middleName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      famMemberTouched?.middleName &&
                                      famMemberErrors?.middleName
                                    }
                                    helperText={
                                      famMemberTouched?.middleName &&
                                      famMemberErrors?.middleName
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Last Name"
                                    name={`familyMembers[${index}].lastName`}
                                    autoComplete="off"
                                    value={famMemberValue.lastName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      famMemberTouched?.lastName &&
                                      famMemberErrors?.lastName
                                    }
                                    helperText={
                                      famMemberTouched?.lastName &&
                                      famMemberErrors?.lastName
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    label="Suffix"
                                    name={`familyMembers[${index}].suffix`}
                                    autoComplete="off"
                                    value={famMemberValue.suffix}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      famMemberTouched?.suffix &&
                                      famMemberErrors?.suffix
                                    }
                                    helperText={
                                      famMemberTouched?.suffix &&
                                      famMemberErrors?.suffix
                                    }
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <MobileDatePicker
                                      label="Date of Birth"
                                      inputFormat="MM/dd/yyyy"
                                      value={famMemberValue.birthdate}
                                      onChange={(value) => {
                                        setFieldValue(
                                          `familyMembers[${index}].birthdate`,
                                          value,
                                          false
                                        );
                                      }}
                                      onBlur={handleBlur}
                                      renderInput={(params) => {
                                        return (
                                          <TextField
                                            size="small"
                                            {...params}
                                            required
                                            fullWidth
                                            name={`familyMembers[${index}].birthdate`}
                                            error={
                                              famMemberTouched?.birthdate &&
                                              famMemberErrors?.birthdate
                                            }
                                            helperText={
                                              famMemberTouched?.birthdate &&
                                              famMemberErrors?.birthdate
                                            }
                                          />
                                        );
                                      }}
                                    />
                                  </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <FormControl
                                    fullWidth
                                    size="small"
                                    required
                                    error={
                                      famMemberTouched?.gender &&
                                      famMemberErrors?.gender
                                    }
                                  >
                                    <InputLabel>Gender</InputLabel>
                                    <Select
                                      value={famMemberValue.gender}
                                      label="Gender"
                                      onChange={(e) => {
                                        setFieldValue(
                                          `familyMembers[${index}].gender`,
                                          e.target.value,
                                          false
                                        );
                                      }}
                                      onBlur={handleBlur}
                                    >
                                      <MenuItem value="male">Male</MenuItem>
                                      <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                    {famMemberTouched?.gender &&
                                      famMemberErrors?.gender && (
                                        <FormHelperText>
                                          {famMemberErrors?.gender}
                                        </FormHelperText>
                                      )}
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                  <TextField
                                    size="small"
                                    required
                                    fullWidth
                                    label="Full Address"
                                    name={`familyMembers[${index}].address`}
                                    autoComplete="off"
                                    value={famMemberValue.address}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={
                                      famMemberTouched?.address &&
                                      famMemberErrors?.address
                                    }
                                    helperText={
                                      famMemberTouched?.address &&
                                      famMemberErrors?.address
                                    }
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
