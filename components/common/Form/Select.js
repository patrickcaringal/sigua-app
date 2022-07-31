import React from "react";

import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";

const SelectComponent = ({
  multiple = false,
  required = false,
  label = "",
  value = "",
  onChange = () => {},
  onBlur = () => {},
  error = null,
  children,
  ...rest
}) => {
  return (
    <FormControl fullWidth size="small" required={required} error={!!error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        multiple={multiple}
        onChange={onChange}
        onBlur={onBlur}
        {...rest}
      >
        {children}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default SelectComponent;
