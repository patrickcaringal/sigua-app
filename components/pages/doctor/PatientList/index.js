import React, { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  deletePatientReq,
  getPatientsReq,
  saveLogReq,
} from "../../../../modules/firebase";
import {
  ACTION_BUTTONS,
  ACTION_ICONS,
  Input,
  PATHS,
  TableContainer,
  confirmMessage,
  getActionButtons,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import TableCells from "./TableCells";

const PatientListPage = () => {
  const { user, isAdmin } = useAuth();

  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [deletePatient] = useRequest(deletePatientReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered); // , undefined, 1

  useEffect(() => {
    filtering.setData(patients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const { data: patientList, error: getError } = await getPatients();
      if (getError) return openErrorDialog(getError);

      setPatients(patientList);
      filtering.setData(patientList);
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
      content: confirmMessage({
        noun: "Patient",
        item: patient.name,
        verb: "archived",
      }),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(patient)}
          size="small"
        >
          archive
        </Button>
      ),
    });
  };

  const handleDelete = async (patient) => {
    // Delete
    const { error: deleteError } = await deletePatient({ patient });
    if (deleteError) return openErrorDialog(deleteError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.DELETE,
      resourceType: RESOURCE_TYPE.PATIENT,
      resourceId: patient.id,
      resourceName: patient.name,
      change: null,
    });

    // Success
    setPatients((prev) => prev.filter((i) => i.id !== patient.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Patient", verb: "archived" }),
      type: "SUCCESS",
    });
  };

  const handleRestoreRedirect = () => {
    router.push(PATHS.DOCTOR.PATIENTS_RESTORE);
  };

  const handleSearchChange = useCallback(
    (e) => {
      pagination.goToPage(0);
      filtering.onNameChange(e?.target?.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.goToPage, filtering.onNameChange]
  );

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
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
              value={filtering.filters.name}
              onChange={handleSearchChange}
            />
          </Box>
          {isAdmin && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleRestoreRedirect}
              startIcon={ACTION_ICONS.RESTORE}
            >
              restore
            </Button>
          )}
        </>
      }
    >
      <TableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {[
                { text: "Name" },
                { text: "Birthdate", sx: { width: 140 } },
                { text: "Age", sx: { width: 40 }, align: "center" },
                { text: "Gender", sx: { width: 100 } },
                { text: "Contact No.", sx: { width: 140 } },
                { text: "Address", sx: { width: 360 } },
                { text: "Actions", sx: { width: 100 }, align: "center" },
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
            {filtering.filtered
              .slice(pagination.info.start, pagination.info.end)
              .map((i, index) => {
                return (
                  <TableRow key={index}>
                    <TableCells data={i} />
                    <TableCell align="center">
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.DETAILS,
                          tooltipText: "Medical Records",
                          onClick: () => handleViewMedicalRecord(i.id),
                        },
                        ...(isAdmin
                          ? [
                              {
                                action: ACTION_BUTTONS.DELETE,
                                tooltipText: "Archive",
                                onClick: () => handleDeleteConfirm(i),
                              },
                            ]
                          : []),
                      ])}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination.pages.length > 1 && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 3,
          }}
        >
          <Pagination
            variant="outlined"
            shape="rounded"
            count={pagination.pages.length}
            page={pagination.info.activePage + 1}
            onChange={handlePageChange}
          />
        </Box>
      )}
    </AdminMainContainer>
  );
};

export default PatientListPage;
