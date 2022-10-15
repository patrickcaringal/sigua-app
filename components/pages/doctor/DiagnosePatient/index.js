import React, { useEffect, useMemo, useState } from "react";

import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { Avatar, Box, Button, Typography } from "@mui/material";
import faker from "faker";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FormikProvider, useFormik } from "formik";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { isMockDataEnabled } from "../../../../modules/env";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  db,
  diagnosePatientReq,
  getBranchesReq,
  getPatientRecordReq,
  getPatientReq,
  saveLogReq,
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
import MedicalHistory from "./MedicalHistory";
import PatientDetails from "./PatientDetails";
import RecordModal from "./RecordModal";

const defaultModal = {
  open: false,
  data: {},
};

const defaultValues = isMockDataEnabled
  ? {
      diagnosis: faker.lorem.paragraph(2),
    }
  : { diagnosis: "" };

const QueueManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);
  const [diagnosePatient] = useRequest(diagnosePatientReq, setBackdropLoader);

  // Local States
  const [queueToday, setQueueToday] = useState({});
  const [patient, setPatient] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patientRecordModal, setPatientRecordModal] = useState(defaultModal);
  const [queueError, setQueueError] = useState(null);

  const doctorId = user.id;
  // const hasQueueToday = !!lodash.keys(queueToday).length;
  const hasPatient = !!lodash.keys(patient).length;
  const currentPatient = useMemo(
    () => queueToday?.counters?.[doctorId]?.queue[0],
    [doctorId, queueToday?.counters]
  );

  const formik = useFormik({
    initialValues: defaultValues,
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
          doctorId: doctorId,
          doctorName: user.name,
        },
      };

      const { data, error: diganoseError } = await diagnosePatient(payload);
      if (diganoseError) return openErrorDialog(diganoseError);

      // savelog
      await saveLogReq({
        actorId: user.id,
        actorName: user.name,
        action: LOG_ACTIONS.CREATE,
        resourceType: RESOURCE_TYPE.MEDICAL_RECORD,
        resourceId: data.id,
        resourceName: data.patientName,
        change: null,
      });

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
      where("openQueue", "==", true),
      where("doctors", "array-contains", doctorId)
    );

    const unsub = onSnapshot(q, (querySnapshot) => {
      const realtimeData = querySnapshot?.docs[0]?.data();
      setQueueToday(realtimeData);

      const qCount = querySnapshot.docs.length;
      if (qCount > 1) {
        setQueueError(
          `Detected ${qCount} overlapping queue containing current Doctor(${realtimeData.branchName} branch will be the priority).`
        );
      } else {
        setQueueError(null);
      }
    });

    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPatient) {
      const fetchPatient = async () => {
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

      const fetchMedicalRecord = async () => {
        // Get Medical Record
        const payload = { id: currentPatient.patientId };
        const { data, error: getError } = await getPatientRecord(payload);
        if (getError) return openErrorDialog(getError);

        setMedicalRecords(data);
      };

      if (!hasPatient) {
        fetchPatient();
        fetchMedicalRecord();
      }
    } else {
      setPatient({});
      setMedicalRecords([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPatient]);

  const handlePatientRecordModalOpen = (data) => {
    setPatientRecordModal({
      open: true,
      data,
    });
  };

  const handlePatientRecordModalClose = () => {
    setPatientRecordModal(defaultModal);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Diagnose Patient" }],
      }}
      toolbarContent={
        <>
          {queueError && (
            <Typography variant="caption" color="error" fontWeight={500}>
              {queueError}
            </Typography>
          )}
          <Button
            variant="contained"
            size="small"
            disabled={!hasPatient}
            onClick={() => formik.submitForm()}
            startIcon={<MedicalInformationIcon />}
          >
            submit diagnosis
          </Button>
        </>
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
          <MedicalHistory
            data={medicalRecords}
            onRecordClick={handlePatientRecordModalOpen}
          />

          {/* Diagnosis */}
          <Box sx={{ mt: 5 }}>
            <Input
              disabled={!hasPatient}
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

      {patientRecordModal.open && (
        <RecordModal
          open={patientRecordModal.open}
          data={patientRecordModal.data}
          onClose={handlePatientRecordModalClose}
        />
      )}
    </AdminMainContainer>
  );
};

export default QueueManagementPage;
