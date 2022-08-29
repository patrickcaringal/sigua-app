import React, { useEffect, useState } from "react";

import { Avatar, Box, Button, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addQueueCounterReq,
  addQueueReq,
  db,
  getBranchesReq,
  getPatientReq,
  resetQueueReq,
  transferQueueItemReq,
  updateQueueRegStatusReq,
  updateQueueStatusReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  pluralize,
  today,
} from "../../../../modules/helper";
import { Input, PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import PatientDetails from "./PatientDetails";

const defaultModal = {
  open: false,
  data: {},
};

const QueueManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [patient, setPatient] = useState({});

  const doctorId = user.id;
  const hasQueueToday = !!lodash.keys(queueToday).length;
  const hasPatient = !!lodash.keys(patient).length;

  const currentPatient = queueToday?.counters?.[doctorId]?.queue[0];
  console.log({ currentPatient });

  useEffect(() => {
    const q = query(
      collection(db, "queues"),
      where("queueDate", "==", today),
      where("doctors", "array-contains", doctorId)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      if (querySnapshot.docs.length === 1) {
        const realtimeData = querySnapshot.docs[0].data();
        setQueueToday(realtimeData);
      } else if (querySnapshot.docs.length > 1) {
        alert("detected more than 1 queue today");
        setQueueToday({});
      } else {
        setQueueToday({});
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPatient) {
      const fetch = async () => {
        // Get Patient
        const payload = { id: currentPatient.patientId };
        const { data, error: getError } = await getPatient(payload);
        if (getError) return openErrorDialog(getError);

        setPatient({
          ...data,
          ...lodash.pick(currentPatient, [
            "queueNo",
            "serviceName",
            "patientNote",
          ]),
        });
      };

      fetch();
    } else {
      setPatient({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPatient]);

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DIAGNOSE),
        paths: [{ text: "Diagnose Patient" }],
      }}
      //   toolbarContent={}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "360px auto",
          gridTemplateRows: "calc(100vh - 144px) auto",
          columnGap: 3,
        }}
      >
        <PatientDetails patient={patient} />
        <Box sx={{ pr: 3 }}>
          {/* Medical history  */}

          {/* Diagnosis */}
          <Box sx={{ mt: 5 }}>
            <Input
              required
              multiline
              label="Doctor Diagnosis"
              name="address"
              rows={5}
              // value={values.address}
              // onChange={(e) =>
              //   setFieldValue("address", e.target.value.toUpperCase())
              // }
              // onBlur={handleBlur}
              // error={getError("address")}
            />
          </Box>
        </Box>
      </Box>
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
