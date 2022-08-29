import React, { useEffect, useState } from "react";

import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FormikProvider, useFormik } from "formik";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  db,
  diagnosePatientReq,
  getBranchesReq,
  getPatientReq,
} from "../../../../modules/firebase";
import {
  formatFirebasetimeStamp,
  formatTimeStamp,
  pluralize,
  today,
} from "../../../../modules/helper";
import { DiagnoseSchema } from "../../../../modules/validation";
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
  const [diagnosePatient] = useRequest(diagnosePatientReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [patient, setPatient] = useState({});

  const doctorId = user.id;
  const hasQueueToday = !!lodash.keys(queueToday).length;
  const hasPatient = !!lodash.keys(patient).length;
  const currentPatient = queueToday?.counters?.[doctorId]?.queue[0];

  // console.log({ queueToday });

  const formik = useFormik({
    initialValues: { diagnosis: "" },
    validationSchema: DiagnoseSchema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        queue: {
          from: `counters.${doctorId}.queue`,
          id: queueToday.id,
          document: currentPatient,
        },
        medicalRecord: {
          queueId: queueToday.id,
          diagnosis: values.diagnosis,
          ...lodash.pick(queueToday, ["branchId", "branchName"]),
          ...lodash.pick(currentPatient, [
            "queueNo",
            "patientId",
            "patientName",
            "patientNote",
            "accountId",
            "serviceId",
            "serviceName",
          ]),
        },
      };

      const { error: diganoseError } = await diagnosePatient(payload);
      if (diganoseError) return openErrorDialog(diganoseError);

      // Successful
      openResponseDialog({
        autoClose: true,
        content: successMessage({
          noun: "Medical Record",
          verb: "saved",
        }),
        type: "SUCCESS",
        closeCb() {
          resetForm();
        },
      });
    },
  });

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
      toolbarContent={
        <Button
          variant="contained"
          size="small"
          disabled={!hasPatient}
          onClick={() => formik.submitForm()}
          startIcon={<MedicalInformationIcon />}
        >
          submit diagnosis
        </Button>
      }
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
              name="diagnosis"
              rows={5}
              value={formik.values.diagnosis}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.diagnosis && formik.errors.diagnosis}
            />
          </Box>
        </Box>
      </Box>
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
