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
} from "@mui/material";
import faker from "faker";
import { FieldArray } from "formik";

import { DatePicker, Input } from "../../../../components/common/Form";
import { isMockDataEnabled } from "../../../../modules/env";
import { formatTimeStamp } from "../../../../modules/helper";

const defaultItem = {
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  birthdate: "",
  gender: "",
  address: "",
  contactNo: "",
};

const Form = ({
  isCreate,
  // formik
  handleChange,
  handleBlur,
  setFieldValue,
  values,
  errors,
  touched,
}) => {
  return (
    <FieldArray
      name="familyMembers"
      render={({ push, remove }) => (
        <>
          {isCreate && (
            <Fab
              color="primary"
              size="small"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              onClick={() => {
                push(
                  isMockDataEnabled
                    ? {
                        firstName: faker.name.firstName(),
                        suffix: "",
                        lastName: faker.name.lastName(),
                        middleName: faker.name.lastName(),
                        address: faker.lorem.paragraph(),
                        birthdate: faker.date.past(
                          faker.datatype.number({
                            min: 10,
                            max: 50,
                          })
                        ),
                        gender: faker.random.arrayElement(["male", "female"]),
                        contactNo: faker.phone.phoneNumber("09#########"),
                      }
                    : defaultItem
                );
              }}
            >
              <AddIcon />
            </Fab>
          )}
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
            {values.familyMembers.map((member, index) => {
              const valueArr = values.familyMembers[index];
              const touchedArr = touched.familyMembers?.[index];
              const errorsArr = errors.familyMembers?.[index];

              const getError = (key) => touchedArr?.[key] && errorsArr?.[key];
              const getFieldName = (field) =>
                `familyMembers[${index}].${field}`;

              return (
                <Card key={index} elevation={isCreate ? 2 : 0}>
                  {isCreate && (
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
                  )}
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Input
                          value={valueArr.firstName}
                          required
                          label="First Name"
                          name={getFieldName("firstName")}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("firstName"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("firstName")}
                          disabled={!isCreate && valueArr.account}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Input
                          value={valueArr.middleName}
                          label="Middle Name"
                          name={getFieldName("middleName")}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("middleName"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("middleName")}
                          disabled={!isCreate && valueArr.account}
                        />
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <Input
                          value={valueArr.lastName}
                          required
                          label="Last Name"
                          name={getFieldName("lastName")}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("lastName"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("lastName")}
                          disabled={!isCreate && valueArr.account}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Input
                          value={valueArr.suffix}
                          label="Suffix"
                          name={getFieldName("suffix")}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("suffix"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("suffix")}
                          disabled={!isCreate && valueArr.account}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <DatePicker
                          value={valueArr.birthdate}
                          required
                          label="Date of Birth"
                          name={getFieldName("birthdate")}
                          onChange={(value) => {
                            if (!value || value == "Invalid Date") return;
                            setFieldValue(
                              getFieldName("birthdate"),
                              formatTimeStamp(value),
                              false
                            );
                          }}
                          onBlur={handleBlur}
                          error={getError("birthdate")}
                          disabled={!isCreate && valueArr.account}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          fullWidth
                          size="small"
                          required
                          error={getError("gender")}
                          disabled={!isCreate && valueArr.account}
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
                        <Input
                          value={valueArr.address}
                          required
                          label="Full Address"
                          name={getFieldName("address")}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("address"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("address")}
                          disabled={!isCreate && valueArr.account}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Input
                          value={valueArr.contactNo}
                          required
                          label="Contact Number"
                          name={getFieldName("contactNo")}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={getError("contactNo")}
                          disabled={!isCreate && valueArr.account}
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
  );
};

export default Form;
