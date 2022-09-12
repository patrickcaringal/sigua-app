import React, { useCallback, useEffect, useState } from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import { getPatientsByBranchReq } from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { Input, LongTypography, PATHS, Pagination } from "../../../common";
import { AdminMainContainer } from "../../../shared";

const PatientListPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsByBranchReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const payload = { id: user.branch };
      const { data: patientList, error: getError } = await getPatients(payload);
      if (getError) return openErrorDialog(getError);

      setPatients(patientList);
      filtering.setData(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleViewMedicalRecord = (id) => {
    router.push({
      pathname: PATHS.STAFF.PATIENTS_MEDICAL_RECORD,
      query: { id },
    });
  };

  const handleSearchChange = useCallback((e) => {
    filtering.onNameChange(e?.target?.value);
    pagination.goToPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.STAFF.DASHBOARD),
        paths: [{ text: "Patient Approval" }],
      }}
      toolbarContent={
        <Box sx={{ width: 200 }}>
          <Input
            debounce
            label="Search"
            value={filtering.filters.name}
            onChange={handleSearchChange}
          />
        </Box>
      }
    >
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Name" },
                { text: "Birthdate", sx: { width: 140 } },
                { text: "Age", sx: { width: 40 }, align: "center" },
                { text: "Gender", sx: { width: 100 } },
                { text: "Contact No.", sx: { width: 140 } },
                { text: "Address", sx: { width: 360 } },
                { text: "Actions", sx: { width: 82 } },
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
              .map((m, index) => {
                const { id, name, gender, birthdate, contactNo, address } = m;

                return (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell>
                      {formatTimeStamp(birthdate, "MMM-dd-yyyy")}
                    </TableCell>
                    <TableCell align="center">
                      {calculateAge(formatTimeStamp(birthdate))}
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {gender}
                    </TableCell>
                    <TableCell>{contactNo}</TableCell>
                    <TableCell>
                      <LongTypography text={address} displayedLines={1} />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Medical Records">
                        <IconButton
                          size="small"
                          onClick={() => handleViewMedicalRecord(id)}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination pagination={pagination} onChange={handlePageChange} />
    </AdminMainContainer>
  );
};

export default PatientListPage;
