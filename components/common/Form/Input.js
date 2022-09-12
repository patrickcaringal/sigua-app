import React, { useEffect, useState } from "react";

import { TextField } from "@mui/material";

const InputComponent = ({
  placeholder = "",
  required = false,
  disabled = false,
  label = "",
  name = "",
  value = "",
  type = "text",
  multiline = false,
  rows = 1,
  onChange = () => {},
  onBlur = () => {},
  error = null,
  debounce = false,
  ...rest
}) => {
  const [debounceValue, setDebounceValue] = useState("");

  useEffect(() => {
    if (debounce) {
      const delayDebounceFn = setTimeout(() => {
        onChange(debounceValue);
      }, 600);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [debounce, onChange, debounceValue]);

  return (
    <TextField
      type={type}
      placeholder={placeholder}
      size="small"
      required={required}
      disabled={disabled}
      fullWidth
      label={label}
      name={name}
      autoComplete="off"
      value={debounce ? debounceValue?.target?.value : value}
      multiline={multiline}
      rows={rows}
      onChange={(e) => (debounce ? setDebounceValue(e) : onChange(e))}
      onBlur={onBlur}
      error={error}
      helperText={error}
      {...rest}
    />
  );
};

export default InputComponent;
