import React, { useEffect, useState } from "react";

import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PeopleIcon from "@mui/icons-material/People";
import { Box } from "@mui/material";
import { subDays } from "date-fns";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import {
  getDoctorsReq,
  getPatientsReq,
  getQueuesByDateRangeReq,
  getRecordsByDateRangeReq,
  getStaffsReq,
} from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import CountCard from "./CountCard";
import QueueGraph from "./QueueGraph";
import ServiceGraph from "./ServiceGraph";

const START_DATE = 7;
const END_DATE = 0;

const DashboardPage = () => {
  const daterange = {
    start: subDays(new Date(), START_DATE),
    end: subDays(new Date(), END_DATE),
  };

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [getStaffs] = useRequest(getStaffsReq, setBackdropLoader);
  const [getDoctors] = useRequest(getDoctorsReq, setBackdropLoader);
  const [getQueues] = useRequest(getQueuesByDateRangeReq, setBackdropLoader);
  const [getMedicalRecords] = useRequest(
    getRecordsByDateRangeReq,
    setBackdropLoader
  );

  // Local States
  const [patients, setPatients] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [queues, setQueues] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      // Get Patients
      const { data, error: getError } = await getPatients();
      if (getError) return openErrorDialog(getError);
      setPatients(data);
    };

    const fetchStaffs = async () => {
      // Get Staffs
      const { data, error: getError } = await getStaffs({
        mapBranch: false,
      });
      if (getError) return openErrorDialog(getError);

      setStaffs(data);
    };

    const fetchDoctors = async () => {
      // Get Doctors
      const { data, error: getError } = await getDoctors({
        mapBranch: false,
      });
      if (getError) return openErrorDialog(getError);
      setDoctors(data);
    };

    const fetchQueues = async () => {
      // Get Queues
      const payload = { ...daterange };
      const { data, error: getError } = await getQueues(payload);
      if (getError) return openErrorDialog(getError);

      setQueues(data);
    };

    // const fetchMedicalRecords = async () => {
    //   // Get MedicalRecords
    //   const payload = { ...daterange };
    //   const { data, error: getError } = await getMedicalRecords(payload);
    //   if (getError) return openErrorDialog(getError);
    //   setMedicalRecords(data);
    // };

    fetchPatients();
    fetchStaffs();
    fetchDoctors();
    fetchQueues();
    // fetchMedicalRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patientGraphData = getPatientGraphData(queues);
  const medicalRecordGraphData = getServiceGraphData(medicalRecords);

  const counters = [
    {
      label: "Online Registered Patients",
      count: patients?.filter((i) => i.registrationType !== "STAFF_REGISTERED")
        ?.length,
      icon: <PeopleIcon sx={{ fontSize: 90, color: "text.secondary" }} />,
    },
    {
      label: "Walk in Patients",
      count: patients?.filter((i) => i.registrationType === "STAFF_REGISTERED")
        ?.length,
      icon: <PeopleIcon sx={{ fontSize: 90, color: "text.secondary" }} />,
    },
    {
      label: "Staffs",
      count: staffs?.length,
      icon: (
        <AssignmentIndIcon sx={{ fontSize: 90, color: "text.secondary" }} />
      ),
    },
    {
      label: "Doctors",
      count: doctors?.length,
      icon: (
        <AssignmentIndIcon sx={{ fontSize: 90, color: "text.secondary" }} />
      ),
    },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        p: 3,
      }}
    >
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
