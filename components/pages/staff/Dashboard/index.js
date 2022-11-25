import React, { useCallback, useEffect, useState } from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { subDays } from "date-fns";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import {
  getPatientsByBranchReq,
  getPatientsForApprovalReq,
  getQueuesByBranchDateRangeReq,
  getRecordsByBranchDateRangeReq,
} from "../../../../modules/firebase";
import { formatTimeStamp, today } from "../../../../modules/helper";
import CountCard from "../../doctor/Dashboard/CountCard";
import QueueGraph from "./QueueGraph";
import ServiceGraph from "./ServiceGraph";

const START_DATE = 7;
const END_DATE = 0;
const DashboardPage = () => {
  const { user } = useAuth();
  const daterange = {
    start: subDays(new Date(), START_DATE),
    end: subDays(new Date(), END_DATE),
  };

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsByBranchReq, setBackdropLoader);
  const [getPatientForApproval] = useRequest(
    getPatientsForApprovalReq,
    setBackdropLoader
  );
  const [getQueues] = useRequest(
    getQueuesByBranchDateRangeReq,
    setBackdropLoader
  );
  const [getMedicalRecords] = useRequest(
    getRecordsByBranchDateRangeReq,
    setBackdropLoader
  );

  // Local States
  const [patients, setPatients] = useState([]);
  const [patientsForApproval, setPatientsForApproval] = useState([]);

  const [queues, setQueues] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      // Get Patients
      const payload = { id: user.branch };
      const { data, error: getError } = await getPatients(payload);
      if (getError) return openErrorDialog(getError);
      setPatients(data);
    };

    const fetchPatientForApproval = async () => {
      // Get Patients
      const { data, error: getPatientsError } = await getPatientForApproval({});
      if (getPatientsError) return openErrorDialog(getPatientsError);
      setPatientsForApproval(data);
    };

    const fetchQueues = async () => {
      // Get Queues
      const payload = {
        id: user.branch,
        ...daterange,
      };
      const { data, error: getError } = await getQueues(payload);
      if (getError) return openErrorDialog(getError);
      setQueues(data);
    };

    // const fetchMedicalRecords = async () => {
    //   // Get MedicalRecords
    //   const payload = {
    //     id: user.branch,
    //     ...daterange,
    //   };
    //   const { data, error: getError } = await getMedicalRecords(payload);
    //   if (getError) return openErrorDialog(getError);
    //   setMedicalRecords(data);
    // };

    fetchPatients();
    fetchPatientForApproval();
    fetchQueues();
    // fetchMedicalRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patientGraphData = getPatientGraphData(queues);
  const medicalRecordGraphData = getServiceGraphData(medicalRecords);

  const counters = [
    {
      label: "Patients with record",
      count: patients?.length,
      icon: <PeopleIcon sx={{ fontSize: 90, color: "text.secondary" }} />,
    },
    {
      label: "Patients for Approval",
      count: patientsForApproval?.length,
      icon: <FactCheckIcon sx={{ fontSize: 90, color: "text.secondary" }} />,
    },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom fontWeight={500}>
        {user?.branchName} Branch
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        {counters.map((i, idx) => (
          <CountCard key={idx} {...i} />
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "row", gap: 3 }}>
        <QueueGraph data={patientGraphData} />
        {/* <ServiceGraph data={medicalRecordGraphData} /> */}
      </Box>
    </Box>
  );
};

export default DashboardPage;

const getPatientGraphData = (data) => {
  const labels = [];

  const subtractDate = START_DATE;
  for (let i = subtractDate; i >= 0; i--) {
    labels.push(formatTimeStamp(subDays(new Date(), i), "MMM-dd-yyyy"));
  }

  const dataset1 = labels.map((i) => {
    const date = formatTimeStamp(i);
    const item = data.filter((j) => j.queueDate === date);
    return item.reduce((acc, j) => acc + j.done.length, 0);
  });

  const dataset2 = labels.map((i) => {
    const date = formatTimeStamp(i);
    const item = data.filter((j) => j.queueDate === date);
    return item.reduce((acc, j) => acc + j.skipped.length, 0);
  });

  return {
    labels,
    dataset1,
    dataset2,
  };
};

const getServiceGraphData = (data) => {
  const dataset = data.reduce((acc, i) => {
    if (i.serviceName in acc) {
      acc[i.serviceName] += 1;
    } else {
      acc[i.serviceName] = 1;
    }

    return acc;
  }, {});

  return dataset;
};
