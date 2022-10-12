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
      name="announcements"
      render={({ push, remove }) => {
        return (
          <>
            {/* {isCreate && (
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
            )} */}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                px: 1,
                py: 1,
                rowGap: 3,
                overflow: "overlay",
                minHeight: 0,
                // minHeight: isCreate ? 280 : 0,
              }}
            >
              {values.announcements.map((s, index) => {
                const valueArr = values.announcements[index];
                const touchedArr = touched.announcements?.[index];
                const errorsArr = errors.announcements?.[index];

                const getError = (field) =>
                  touchedArr?.[field] && errorsArr?.[field];
                const getFieldName = (field) =>
                  `announcements[${index}].${field}`;

                return (
                  <Card key={index} elevation={0}>
                    {/* {isCreate && (
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
                        title={`Title ${index + 1}`}
                      />
                    )} */}
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12}>
                          <Input
                            required
                            label="Title"
                            name={getFieldName("title")}
                            value={valueArr.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={getError("title")}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Input
                            multiline
                            rows={2}
                            required
                            label="Content"
                            name={`announcements[${index}].content`}
                            value={valueArr.content}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={getError("content")}
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
