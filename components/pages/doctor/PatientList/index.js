import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { deletePatientReq, getPatientsReq } from "../../../../modules/firebase";
import {
  ACTION_BUTTONS,
  ACTION_ICONS,
  Input,
  PATHS,
  confirmMessage,
  getActionButtons,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import TableCells from "./TableCells";
import useFilter from "./useFilter";

const PatientListPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [deletePatient] = useRequest(deletePatientReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const { filtered, setData, filters, onNameChange } = useFilter({});

  useEffect(() => {
    setData(patients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients]);

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const { data: patientList, error: getError } = await getPatients();
      if (getError) return openErrorDialog(getError);

      setPatients(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewMedicalRecord = (id) => {
    router.push({
      pathname: PATHS.DOCTOR.PATIENTS_MEDICAL_RECORD,
      query: { id },
    });
  };

  const handleDeleteConfirm = (patient) => {
    openResponseDialog({
      content: confirmMessage({ noun: "Patient", item: patient.name }),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(patient)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (patient) => {
    // Delete
    const { error: deleteError } = await deletePatient({ patient });
    if (deleteError) return openErrorDialog(deleteError);

    // Success
    setPatients((prev) => prev.filter((i) => i.id !== patient.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Patient", verb: "deleted" }),
      type: "SUCCESS",
    });
  };

  const handleRestoreRedirect = () => {
    router.push(PATHS.DOCTOR.PATIENTS_RESTORE);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Patient Records" }],
      }}
      toolbarContent={
        <>
          <Box sx={{ width: 200 }}>
            <Input
              debounce
              label="Search"
              value={filters.name}
              onChange={(e) => onNameChange(e?.target?.value)}
            />
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRestoreRedirect}
            startIcon={ACTION_ICONS.RESTORE}
          >
            restore
          </Button>
        </>
      }
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Name" },
                { text: "Birthdate", sx: { width: 140 } },
                { text: "Age", sx: { width: 100 }, align: "center" },
                { text: "Gender", sx: { width: 100 } },
                { text: "Contact No.", sx: { width: 140 } },
                { text: "Address" },
                { text: "Actions", sx: { width: 100 } },
              ].map(({ text, align, sx }) => (
                <TableCell
                  key={text}
                  {...(align && { align })}
                  sx={{ ...sx, fontWeight: "bold", p: 2 }}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((i, index) => {
              return (
                <TableRow key={i.id}>
                  <TableCells data={i} />
                  <TableCell align="center">
                    {getActionButtons([
                      {
                        action: ACTION_BUTTONS.DETAILS,
                        tooltipText: "Medical Records",
                        onClick: () => handleViewMedicalRecord(i.id),
                      },
                      {
                        action: ACTION_BUTTONS.DELETE,
                        tooltipText: "Delete",
                        onClick: () => handleDeleteConfirm(i),
                      },
                    ])}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminMainContainer>
  );
};

export default PatientListPage;
