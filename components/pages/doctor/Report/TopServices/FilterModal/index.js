import React, { useEffect, useState } from "react";

import FilterListIcon from "@mui/icons-material/FilterList";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  endOfMonth,
  endOfYear,
  getYear,
  isAfter,
  isBefore,
  isThisYear,
  startOfMonth,
  startOfYear,
} from "date-fns";

import { useBackdropLoader } from "../../../../../../contexts/BackdropLoaderContext";
import { useRequest } from "../../../../../../hooks";
import { getBranchesReq } from "../../../../../../modules/firebase";
import { formatTimeStamp } from "../../../../../../modules/helper";
import {
  Datalist,
  DatePicker,
  Input,
  Modal,
  Select,
} from "../../../../../common";
import useFilter from "./useFilter";

const FilterModal = ({ open = false, data, onApply, onClose, branches }) => {
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  // const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  // const [branches, setBranches] = useState([]);

  // useEffect(() => {
  //   const fetchBranches = async () => {
  //     // Get Branches
  //     const { data, error } = await getBranches({ mapService: false });
  //     if (error) return openErrorDialog(error);

  //     setBranches(data);
  //   };

  //   fetchBranches();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  const filtering = useFilter({
    ...data,
  });

  const handleClose = () => {
    onClose();
  };

  const handleStartateChange = (value) => {
    const v = value ? formatTimeStamp(value) : "";

    if (
      filtering.filters.endDate &&
      isAfter(new Date(v), new Date(filtering.filters.endDate))
    ) {
      return filtering.setEndDate(v);
    }

    filtering.setStartDate(v);
  };

  const handleEndDateChange = (value) => {
    const v = value ? formatTimeStamp(value) : "";

    if (
      filtering.filters.startDate &&
      isBefore(new Date(v), new Date(filtering.filters.startDate))
    ) {
      return filtering.setStartDate(v);
    }

    filtering.setEndDate(v);
  };

  const handleApply = () => {
    onApply(filtering.filters);
    handleClose();
  };

  const handleRangeDisplayChange = (e) => {
    const v = e.target.value;

    filtering.setRangeDisplay(v);
    // handleYearChange(new Date());
  };

  const handleMonthChange = (v) => {
    const s = startOfMonth(new Date(v));
    const e = endOfMonth(s);

    filtering.setStartDate(formatTimeStamp(s));
    filtering.setEndDate(formatTimeStamp(e));
  };

  const handleYearChange = (v) => {
    const s = startOfYear(new Date(v));
    const e = endOfYear(s);

    filtering.setStartDate(formatTimeStamp(s));
    filtering.setEndDate(formatTimeStamp(e));
  };

  return (
    <Modal width="xs" open={open} onClose={handleClose}>
      <Box sx={{ overflow: "overlay" }}>
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <FilterListIcon />
              <Typography sx={{ flex: 1, ml: 1 }} variant="h6" component="div">
                Filters
              </Typography>

              <Button color="inherit" onClick={handleApply}>
                Apply
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Close
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2 }}>
          <Container maxWidth="lg">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Select
                  value={filtering.filters.rangeDisplay}
                  label="Range Display"
                  onChange={handleRangeDisplayChange}
                >
                  <MenuItem value="custom" dense>
                    Custom
                  </MenuItem>
                  <MenuItem value="permonth" dense>
                    Per Month
                  </MenuItem>
                  <MenuItem value="peryear" dense>
                    Per Year
                  </MenuItem>
                </Select>
              </Grid>
              {["permonth"].includes(filtering.filters.rangeDisplay) && (
                <Grid item xs={12}>
                  <DatePicker
                    views={["year", "month"]}
                    label="Month"
                    value={filtering.filters.startDate}
                    onChange={handleMonthChange}
                    renderInput={(params) => (
                      <Input
                        {...params}
                        error={null}
                        inputProps={{
                          ...params.inputProps,
                          value: filtering.filters.startDate
                            ? formatTimeStamp(
                                new Date(filtering.filters.startDate),
                                "MMMM yyyy"
                              )
                            : "",
                        }}
                      />
                    )}
                    minDate={new Date("2020-01-01")}
                    maxDate={new Date()}
                  />
                </Grid>
              )}

              {["peryear"].includes(filtering.filters.rangeDisplay) && (
                <Grid item xs={12}>
                  <DatePicker
                    views={["year"]}
                    label="Year"
                    value={filtering.filters.startDate}
                    onChange={handleYearChange}
                    renderInput={(params) => (
                      <Input
                        {...params}
                        error={null}
                        inputProps={{
                          ...params.inputProps,
                          value: filtering.filters.startDate
                            ? getYear(new Date(filtering.filters.startDate))
                            : "",
                        }}
                      />
                    )}
                    minDate={new Date("2020-01-01")}
                    maxDate={new Date()}
                  />
                </Grid>
              )}

              {["custom"].includes(filtering.filters.rangeDisplay) && (
                <>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Start Date"
                      value={filtering.filters.startDate}
                      onChange={handleStartateChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="End Date"
                      value={filtering.filters.endDate}
                      onChange={handleEndDateChange}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12}>
                <Select
                  value={filtering.filters.branch}
                  label="Branch"
                  onChange={(e) => {
                    filtering.setBranch(e.target.value);
                  }}
                >
                  <MenuItem value="-" dense>
                    All
                  </MenuItem>
                  {branches.map(({ id, name }) => (
                    <MenuItem key={id} value={id} dense>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
