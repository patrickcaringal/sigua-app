import React from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Fab,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FieldArray } from "formik";

import { DatePicker, Input } from "../../../../components/common/Form";

const defaultItem = {
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

const Form = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  return (
    <FieldArray
      name="staffs"
      render={({ push, remove }) => {
        return (
          <>
            <Fab
              color="primary"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              onClick={() => {
                push(defaultItem);
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
              {values.staffs.map((s, index) => {
                const valueArr = values.staffs[index];
                const touchedArr = touched.staffs?.[index];
                const errorsArr = errors.staffs?.[index];

                const getError = (field) =>
                  touchedArr?.[field] && errorsArr?.[field];
                const getFieldName = (field) => `staffs[${index}].${field}`;

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
                      title={`Staff ${index + 1}`}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Input
                            required
                            label="First Name"
                            name={getFieldName("firstName")}
                            value={valueArr.firstName}
                            onChange={(e) =>
                              setFieldValue(
                                getFieldName("firstName"),
                                e.target.value.toUpperCase()
                              )
                            }
                            onBlur={handleBlur}
                            error={getError("firstName")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Input
                            required
                            label="Middle Name"
                            name={getFieldName("middleName")}
                            value={valueArr.middleName}
                            onChange={(e) =>
                              setFieldValue(
                                getFieldName("middleName"),
                                e.target.value.toUpperCase()
                              )
                            }
                            onBlur={handleBlur}
                            error={getError("middleName")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={9}>
                          <Input
                            required
                            label="Last Name"
                            name={getFieldName("lastName")}
                            value={valueArr.lastName}
                            onChange={(e) =>
                              setFieldValue(
                                getFieldName("lastName"),
                                e.target.value.toUpperCase()
                              )
                            }
                            onBlur={handleBlur}
                            error={getError("lastName")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Input
                            label="Suffix"
                            name={getFieldName("suffix")}
                            value={valueArr.suffix}
                            onChange={(e) =>
                              setFieldValue(
                                getFieldName("suffix"),
                                e.target.value.toUpperCase()
                              )
                            }
                            onBlur={handleBlur}
                            error={getError("suffix")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            value={valueArr.birthdate}
                            required
                            label="Date of Birth"
                            name={getFieldName("birthdate")}
                            onChange={(value) => {
                              setFieldValue(
                                getFieldName("birthdate"),
                                value,
                                false
                              );
                            }}
                            onBlur={handleBlur}
                            error={getError("birthdate")}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            fullWidth
                            size="small"
                            required
                            error={getError("gender")}
                          >
                            <InputLabel>Gender</InputLabel>
                            <Select
                              value={valueArr.gender}
                              label="Gender"
                              onChange={(e) => {
                                setFieldValue(
                                  getFieldName("gender"),
                                  e.target.value,
                                  false
                                );
                              }}
                              onBlur={handleBlur}
                            >
                              <MenuItem value="male">Male</MenuItem>
                              <MenuItem value="female">Female</MenuItem>
                            </Select>
                            {getError("gender") && (
                              <FormHelperText>
                                {getError("gender")}
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
                            name={getFieldName("address")}
                            autoComplete="off"
                            value={valueArr.address}
                            onChange={(e) =>
                              setFieldValue(
                                getFieldName("address"),
                                e.target.value.toUpperCase()
                              )
                            }
                            onBlur={handleBlur}
                            error={getError("address")}
                            helperText={getError("address")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Input
                            required
                            label="Email"
                            name={getFieldName("email")}
                            value={valueArr.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={getError("email")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <FormControl
                            fullWidth
                            size="small"
                            required
                            error={getError("branch")}
                          >
                            <InputLabel>Branch</InputLabel>
                            <Select
                              value={valueArr.branch}
                              label="Branch"
                              onChange={(e) => {
                                setFieldValue(
                                  getFieldName("branch"),
                                  e.target.value,
                                  false
                                );
                              }}
                              onBlur={handleBlur}
                            >
                              <MenuItem value="LAKESIDE">Lakeside</MenuItem>
                              <MenuItem value="MABUHAY">Mabuhay</MenuItem>
                              <MenuItem value="SOUTHVILLE">Sunrise</MenuItem>
                            </Select>
                            {getError("branch") && (
                              <FormHelperText>
                                {getError("branch")}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          </>
        );
      }}
    />
  );
};

export default Form;
