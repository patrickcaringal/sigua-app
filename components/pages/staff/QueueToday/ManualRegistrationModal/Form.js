import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";

import { Input, Select } from "../../../../../components/common/Form";
import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../../hooks/useRequest";
import { getServicesReq } from "../../../../../modules/firebase";
import PatientSelectModal from "./PatientSelectModal";

const defaultModal = {
  open: false,
  data: {},
};

const Form = ({
  values,
  touched,
  errors,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getServices, servicesLoading] = useRequest(getServicesReq);

  // Local States
  const [services, setServices] = useState([]);
  const [patientSelectModal, setPatientSelectModal] = useState(defaultModal);

  const getError = (field) => touched?.[field] && errors?.[field];

  // const getPatientInfo = (id) => patients.find((i) => i.id === id) || {};
  const getServiceInfo = (id) => services.find((i) => i.id === id) || {};

  useEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const { data: serviceList, error: getServicesError } =
        await getServices();
      if (getServicesError) return openErrorDialog(getServicesError);

      setServices(serviceList);
    };

    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePatientSelect = (patient) => {
    setFieldValue("accountId", patient.accountId, false);
    setFieldValue("patientId", patient.id, false);
    setFieldValue("patientName", patient.name, false);
    setFieldValue("patientContactNo", patient.contactNo, false);
  };

  const handlePatientSelectModalOpen = () => {
    setPatientSelectModal({
      open: true,
      data: {},
    });
  };

  const handlePatientSelectModalClose = () => {
    setPatientSelectModal(defaultModal);
  };

  return (
    <>
      <Card elevation={0} sx={{ mt: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                {values.patientName && (
                  <Typography>{values.patientName}</Typography>
                )}
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handlePatientSelectModalOpen}
                >
                  choose a patient
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Select
                disabled={servicesLoading}
                required
                value={values.serviceId}
                label="Service"
                onChange={(e) => {
                  const val = e.target.value;
                  setFieldValue("serviceId", val, false);

                  const { name } = getServiceInfo(val);
                  setFieldValue("serviceName", name, false);
                }}
                onBlur={handleBlur}
                error={getError("serviceId")}
              >
                {services.map(({ id, name }) => (
                  <MenuItem key={id} value={id} dense>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Input
                multiline
                rows={2}
                placeholder="Anything related to the purpose of your clinic visit."
                required
                label="Note"
                name="patientNote"
                value={values.patientNote}
                onChange={handleChange}
                // onChange={(e) =>
                //   setFieldValue("patientNote", e.target.value.toUpperCase())
                // }
                onBlur={handleBlur}
                error={getError("patientNote")}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      {patientSelectModal.open && (
        <PatientSelectModal
          open={patientSelectModal.open}
          onSelect={handlePatientSelect}
          onClose={handlePatientSelectModalClose}
        />
      )}
    </>
  );
};

export default Form;
