import React from "react";

import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Fab,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import faker from "faker";
import { FieldArray } from "formik";

import { Input, Select } from "../../../../components/common/Form";

const defaultItem = {
  name: "",
  services: [],
  address: "",
  capacity: "",
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const Form = ({
  services,
  isCreate,
  // formik
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  return (
    <FieldArray
      name="branches"
      render={({ push, remove }) => (
        <>
          {isCreate && (
            <Fab
              color="primary"
              sx={{ position: "absolute", bottom: 16, right: 16 }}
              onClick={() => {
                push(
                  true
                    ? {
                        name: faker.git.branch(),
                        services: [],
                        address: faker.lorem.paragraph(),
                        capacity: faker.datatype.number(),
                      }
                    : defaultItem
                );
              }}
              size="small"
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
              minHeight: isCreate ? 303 : 0,
            }}
          >
            {values.branches.map((s, index) => {
              const valueArr = values.branches[index];
              const touchedArr = touched.branches?.[index];
              const errorsArr = errors.branches?.[index];

              const getError = (field) =>
                touchedArr?.[field] && errorsArr?.[field];
              const getFieldName = (field) => `branches[${index}].${field}`;

              return (
                <Card key={index} elevation={isCreate ? 2 : 0}>
                  {isCreate && (
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
                  )}

                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={8}>
                        <Input
                          required
                          label="Branch Name"
                          name={getFieldName("name")}
                          value={valueArr.name}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("name"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("name")}
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Input
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          required
                          label="Capacity"
                          name={getFieldName("capacity")}
                          value={valueArr.capacity}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={getError("capacity")}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Select
                          multiple
                          required
                          label="Services"
                          value={valueArr.services}
                          input={<OutlinedInput label="Services" />}
                          renderValue={(selected) => selected.join(", ")}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFieldValue(
                              getFieldName("services"),
                              typeof value === "string"
                                ? value.split(",")
                                : value
                            );
                          }}
                          onBlur={handleBlur}
                          error={getError("gender")}
                        >
                          {services.map(({ id, name }) => (
                            <MenuItem key={id} value={name}>
                              <Checkbox
                                checked={valueArr.services.includes(name)}
                              />
                              <ListItemText primary={name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </Grid>
                      <Grid item xs={12}>
                        <Input
                          multiline
                          rows={2}
                          required
                          label="Address"
                          name={getFieldName("address")}
                          value={valueArr.address}
                          onChange={(e) =>
                            setFieldValue(
                              getFieldName("address"),
                              e.target.value.toUpperCase()
                            )
                          }
                          onBlur={handleBlur}
                          error={getError("address")}
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
