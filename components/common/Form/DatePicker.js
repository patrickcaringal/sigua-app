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
  onChange = () => {},
  onBlur = () => {},
  error = null,
  //   ...rest
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        label={label}
        inputFormat="MM/dd/yyyy"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        renderInput={(params) => (
          <Input {...params} required={required} name={name} error={error} />
        )}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent;
