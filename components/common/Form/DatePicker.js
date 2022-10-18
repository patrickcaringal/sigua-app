import React from "react";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

import Input from "./Input";

const DatePickerComponent = ({
  required = false,
  label = "",
  name = "",
  value = "",
  views = ["year", "day"],
  onChange = () => {},
  onBlur = () => {},
  error = null,
  renderInput = (params) => (
    <Input {...params} required={required} name={name} error={error} />
  ),
  //   ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        views={views}
        label={label}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        renderInput={renderInput}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
