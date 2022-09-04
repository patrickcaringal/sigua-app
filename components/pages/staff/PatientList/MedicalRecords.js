import React, { useEffect, useState } from "react";

import { Box } from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  getPatientRecordReq,
  getPatientReq,
} from "../../../../modules/firebase";
import { PATHS } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import MedicalHistory from "../../doctor/DiagnosePatient/MedicalHistory";
import RecordModal from "../../doctor/DiagnosePatient/RecordModal";
import PatientDetails from "./PatientDetails";

const defaultModal = {
  open: false,
  data: {},
};

const MedicalRecordPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  const patientId = router.query.id;

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);

  // Local States
  const [patient, setPatient] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patientRecordModal, setPatientRecordModal] = useState(defaultModal);

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        // Get Patient
        const payload = { id: patientId };
        const { data, error: getError } = await getPatient(payload);
        if (getError) return openErrorDialog(getError);

        setPatient(data);
      };

      const fetchMedicalRecord = async () => {
        // Get Medical Record
        const payload = { id: patientId };
        const { data, error: getError } = await getPatientRecord(payload);
        if (getError) return openErrorDialog(getError);

        setMedicalRecords(data);
      };

      fetchPatient();
      fetchMedicalRecord();
    } else {
      setPatient({});
      setMedicalRecords([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

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
        onRootClick: () => router.push(PATHS.STAFF.DASHBOARD),
        paths: [
          {
            text: "Medical Records",
            // onClick: () => router.push(PATHS.STAFF.PATIENTS_LIST),
          },
          { text: patient.name },
        ],
      }}
      // toolbarContent={}
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

export default MedicalRecordPage;
