import React, { useEffect, useState } from "react";

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
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  getServicesReq,
  getVerifiedFamilyMembersReq,
} from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";

const Form = ({
  branches,
  isCreate,
  // isStaff,
  // formik
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
  const [getPatientsReq, patientsLoading] = useRequest(
    getVerifiedFamilyMembersReq
  );

  // Local States
  const [services, setServices] = useState([]);
  const [patients, setPatients] = useState([]);

  const getError = (field) => touched?.[field] && errors?.[field];

  const getPatientInfo = (id) => patients.find((i) => i.id === id) || {};
  const getServiceInfo = (id) => services.find((i) => i.id === id) || {};

  useEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const { data: serviceList, error: getServicesError } =
        await getServices();
      if (getServicesError) return openErrorDialog(getServicesError);

      setServices(serviceList);
    };

    const fetchPatients = async () => {
      // Get Services
      const payload = { id: values.accountId };
      const { data: patientList, error: getPatientsError } =
        await getPatientsReq(payload);
      if (getPatientsError) return openErrorDialog(getPatientsError);

      setPatients(patientList);
    };

    fetchServices();
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card elevation={0} sx={{ mt: 2 }}>
      {/* <CardHeader title="title" /> */}
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select
              disabled={patientsLoading}
              required
              value={values.patientId}
              label="Family Member"
              onChange={(e) => {
                const val = e.target.value;
                setFieldValue("patientId", val, false);

                const { name, contactNo } = getPatientInfo(val);
                setFieldValue("patientName", name, false);
                setFieldValue("patientContactNo", contactNo, false);
              }}
              onBlur={handleBlur}
              error={getError("patientId")}
            >
              {patients.map(({ id, name }) => (
                <MenuItem key={id} value={id} dense>
                  {name}
                </MenuItem>
              ))}
            </Select>
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
              onChange={(e) =>
                setFieldValue("patientNote", e.target.value.toUpperCase())
              }
              onBlur={handleBlur}
              error={getError("patientNote")}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Form;
