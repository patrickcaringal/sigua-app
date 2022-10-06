import React, { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, ButtonGroup } from "@mui/material";
import faker from "faker";
import { jsPDF } from "jspdf";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  getPatientRecordReq,
  getPatientReq,
} from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { exportPatientRecords } from "../../../../modules/pdf";
import { PATHS } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import MedicalHistory from "../../doctor/DiagnosePatient/MedicalHistory";
import RecordModal from "../../doctor/DiagnosePatient/RecordModal";
import FilterModal from "./FilterModal";
import useFilter from "./FilterModal/useFilter";
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
  const [filterModal, setFilterModal] = useState(defaultModal);
  const filtering = useFilter({});

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

  useEffect(() => {
    filtering.setData(medicalRecords);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicalRecords]);

  const handlePatientRecordModalOpen = (data) => {
    setPatientRecordModal({
      open: true,
      data,
    });
  };

  const handlePatientRecordModalClose = () => {
    setPatientRecordModal(defaultModal);
  };

  const handleFilterModalOpen = () => {
    setFilterModal({
      open: true,
      data: filtering.filters,
    });
  };

  const handleFilterModalClose = () => {
    setFilterModal(defaultModal);
  };

  const handleFilterApply = (filters) => {
    filtering.setFilters(filters);
  };

  const handleClearFilter = () => {
    filtering.clear();
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
      toolbarContent={
        <>
          <Button
            onClick={() => exportPatientRecords(filtering.filtered, patient)}
          >
            PDF
          </Button>
          <ButtonGroup variant="contained" size="small">
            <Button
              size="small"
              onClick={handleFilterModalOpen}
              startIcon={<FilterListIcon />}
            >
              filters
            </Button>
            {!!filtering.hasFilter && (
              <Button size="small" onClick={handleClearFilter}>
                <ClearIcon fontSize="small" />
              </Button>
            )}
          </ButtonGroup>
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
            data={filtering.filtered}
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

      {filterModal.open && (
        <FilterModal
          open={filterModal.open}
          data={filterModal.data}
          onApply={handleFilterApply}
          onClose={handleFilterModalClose}
        />
      )}
    </AdminMainContainer>
  );
};

export default MedicalRecordPage;
