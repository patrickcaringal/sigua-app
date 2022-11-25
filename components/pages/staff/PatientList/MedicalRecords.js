import React, { useEffect, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Box, Button, ButtonGroup } from "@mui/material";
import faker from "faker";
import { jsPDF } from "jspdf";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  deleteMedicalRecordReq,
  getPatientRecordReq,
  getPatientReq,
} from "../../../../modules/firebase";
import { formatTimeStamp } from "../../../../modules/helper";
import { exportPatientRecords } from "../../../../modules/pdf";
import {
  ACTION_ICONS,
  PATHS,
  confirmMessage,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import MedicalHistory from "../../doctor/DiagnosePatient/MedicalHistory";
import RecordModal from "../../doctor/DiagnosePatient/RecordModal";
import EditRecordModal from "./EditRecordModal";
import FilterModal from "./FilterModal";
import useFilter from "./FilterModal/useFilter";
import PatientDetails from "./PatientDetails";

const defaultModal = {
  open: false,
  data: {},
};

const MedicalRecordPage = () => {
  const router = useRouter();
  const { isAdmin } = useAuth();

  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  const patientId = router.query.id;

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);
  const [deleteMedicalRecord] = useRequest(
    deleteMedicalRecordReq,
    setBackdropLoader
  );

  // Local States
  const [patient, setPatient] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [patientRecordModal, setPatientRecordModal] = useState(defaultModal);
  const [editRecordModal, setEditRecordModal] = useState(defaultModal);
  const [filterModal, setFilterModal] = useState(defaultModal);
  const filtering = useFilter({ ...router.query });

  const fetchMedicalRecord = async () => {
    // Get Medical Record
    const payload = { id: patientId };
    const { data, error: getError } = await getPatientRecord(payload);
    if (getError) return openErrorDialog(getError);

    setMedicalRecords(data);
  };

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        // Get Patient
        const payload = { id: patientId };
        const { data, error: getError } = await getPatient(payload);
        if (getError) return openErrorDialog(getError);

        setPatient(data);
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

  const handleEditRecordModalOpen = (data) => {
    setEditRecordModal({
      open: true,
      data,
    });
  };

  const handleEditRecordModalClose = () => {
    setEditRecordModal(defaultModal);
  };

  const handleDeleteConfirm = (i) => {
    openResponseDialog({
      content: confirmMessage({ item: "Medical Record" }),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(i)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (i) => {
    const payload = { id: i.id };
    const { error } = await deleteMedicalRecord(payload);
    if (error) return openErrorDialog(error);

    // Success
    fetchMedicalRecord();
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Medical Record", verb: "deleted" }),
      type: "SUCCESS",
    });
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
            startIcon={ACTION_ICONS.EXPORT}
            disabled={!filtering.filtered.length}
          >
            export
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
          <Box
            sx={{
              minHeight: "calc(100vh - 64px - 64px - 30px )",
            }}
          >
            <MedicalHistory
              data={filtering.filtered}
              onRecordClick={handlePatientRecordModalOpen}
              onEdit={isAdmin && handleEditRecordModalOpen}
              onDelete={isAdmin && handleDeleteConfirm}
              maxHeight="calc(100vh - 150px)"
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

      {editRecordModal.open && (
        <EditRecordModal
          open={editRecordModal.open}
          data={editRecordModal.data}
          onClose={handleEditRecordModalClose}
          onSave={fetchMedicalRecord}
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
