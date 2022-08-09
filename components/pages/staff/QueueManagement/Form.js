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
  MenuItem,
} from "@mui/material";
import faker from "faker";
import { FieldArray } from "formik";

import { Input, Select } from "../../../../components/common/Form";
import { isMockDataEnabled } from "../../../../modules/env";
import { formatTimeStamp } from "../../../../modules/helper";

const Form = ({
  branches,
  isCreate,
  isStaff,
  // formik
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  const { date, branchId, capacity } = values;
  const getError = (field) => touched?.[field] && errors?.[field];

  const getBranchCapacity = (b) => {
    const { capacity = "" } = branches.find((i) => i.id === b) || {};
    return capacity;
  };

  return (
    <Card elevation={0}>
      <CardHeader title={formatTimeStamp(date, "MMM dd, yyyy eeee")} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <Select
              disabled={isStaff}
              required
              value={branchId}
              label="Branch"
              onChange={(e) => {
                const val = e.target.value;
                setFieldValue("branchId", val, false);
                setFieldValue("capacity", getBranchCapacity(val), false);
              }}
              onBlur={handleBlur}
              error={getError("branchId")}
            >
              {branches.map(({ id, name }) => (
                <MenuItem key={id} value={id} dense>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Input
              disabled={!branchId}
              type="number"
              InputProps={{ inputProps: { min: 0 } }}
              required
              label="Capacity"
              name="capacity"
              value={capacity}
              onChange={handleChange}
              onBlur={handleBlur}
              error={getError("capacity")}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Form;
