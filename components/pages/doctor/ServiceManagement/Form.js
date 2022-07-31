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
  Grid,
  IconButton,
} from "@mui/material";
import faker from "faker";
import { FieldArray } from "formik";

import { Input } from "../../../../components/common/Form";
import { isMockDataEnabled } from "../../../../modules/env";

const defaultItem = {
  name: "",
  description: "",
};

const Form = ({
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
      name="services"
      render={({ push, remove }) => {
        return (
          <>
            {isCreate && (
              <Fab
                color="primary"
                sx={{ position: "absolute", bottom: 16, right: 16 }}
                onClick={() => {
                  push(
                    isMockDataEnabled
                      ? {
                          name: faker.lorem.words(),
                          description: faker.lorem.paragraph(),
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
                minHeight: isCreate ? 280 : 0,
              }}
            >
              {values.services.map((s, index) => {
                const valueArr = values.services[index];
                const touchedArr = touched.services?.[index];
                const errorsArr = errors.services?.[index];

                const getError = (field) =>
                  touchedArr?.[field] && errorsArr?.[field];
                const getFieldName = (field) => `services[${index}].${field}`;

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
                        title={`Service ${index + 1}`}
                      />
                    )}
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <Input
                            required
                            label="Service"
                            name={getFieldName("name")}
                            value={valueArr.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={getError("name")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Input
                            multiline
                            rows={2}
                            required
                            label="Description"
                            name={`services[${index}].description`}
                            value={valueArr.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={getError("description")}
                          />
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
