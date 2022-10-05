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
import { isAfter, isBefore } from "date-fns";

import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useRequest } from "../../../../../hooks";
import {
  getBranchesReq,
  getServicesReq,
} from "../../../../../modules/firebase";
import { formatTimeStamp } from "../../../../../modules/helper";
import { Datalist, DatePicker, Modal, Select } from "../../../../common";
import useFilter from "./useFilter";

const FilterModal = ({ open = false, data, onApply, onClose }) => {
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    const fetchBranches = async () => {
      // Get Branches
      const { data, error } = await getBranches({ mapService: false });
      if (error) return openErrorDialog(error);

      setBranches(data);
    };

    const fetchServices = async () => {
      // Get Services
      const { data, map: serviceMap, error } = await getServices();
      if (error) return openErrorDialog(error);

      setServices(data);
    };

    fetchBranches();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   filtering.setBranch(e.target.value);
  // }, [branches]);

  const filtering = useFilter({
    defaultStartDate: data.startDate,
    defaultEndDate: data.endDate,
    defaultBranch: data.branch,
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
              <Grid item xs={12}>
                <Select
                  value={filtering.filters.service}
                  label="Service"
                  onChange={(e) => {
                    filtering.setService(e.target.value);
                  }}
                >
                  <MenuItem value="-" dense>
                    All
                  </MenuItem>
                  {services.map(({ id, name }) => (
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
