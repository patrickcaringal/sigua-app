import React, { useCallback, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Box,
  Button,
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
import { REG_TYPE, getAccountsReq } from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { Input, LongTypography, PATHS, Pagination } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import CreateAccountModal from "./CreateAccountModal";

const defaultModal = {
  open: false,
  data: {},
};

const PatientListPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getAccountsReq, setBackdropLoader);

  // Local States
  const [createAccountModal, setCreateAccountModal] = useState(defaultModal); // Phone Verification Modal
  const [patients, setPatients] = useState([]);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const { data, error: getError } = await getPatients();
      if (getError) return openErrorDialog(getError);

      setPatients(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(patients);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients]);

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

  const handleCreate = (newDocs) => {
    setPatients((prev) => [...prev, ...newDocs]);
  };

  const handleAccountModalOpen = () => {
    setCreateAccountModal({
      open: true,
      data: {},
    });
  };

  const handleAccountModalClose = () => {
    setCreateAccountModal(defaultModal);
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
        onRootClick: () => router.push(PATHS.STAFF.DASHBOARD),
        paths: [{ text: "Patient Accounts" }],
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
          <Button
            variant="contained"
            size="small"
            onClick={handleAccountModalOpen}
            startIcon={<AddCircleIcon />}
          >
            create account
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
                { text: "Contact No.", sx: { width: 140 } },
                { text: "Sign Up Date", sx: { width: 150 } },
                { text: "Registration Type", sx: { width: 150 } },
                { text: "Family Members", sx: { width: 150 }, align: "center" },
                // { text: "Birthdate", sx: { width: 140 } },
                // { text: "Age", sx: { width: 40 }, align: "center" },
                // { text: "Gender", sx: { width: 100 } },
                // { text: "Address", sx: { width: 360 } },
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
                const {
                  id,
                  name,
                  gender,
                  birthdate,
                  contactNo,
                  address,
                  dateCreated,
                  familyMembers,
                  registrationType,
                } = m;

                return (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{contactNo}</TableCell>
                    <TableCell>
                      {formatTimeStamp(dateCreated, "MMM-dd-yyyy")}
                    </TableCell>
                    {/* <TableCell>
                      {formatTimeStamp(birthdate, "MMM-dd-yyyy")}
                    </TableCell> */}
                    {/* <TableCell align="center">
                      {calculateAge(formatTimeStamp(birthdate))}
                    </TableCell> */}
                    {/* <TableCell sx={{ textTransform: "capitalize" }}>
                      {gender}
                    </TableCell> */}
                    {/* <TableCell>
                      <LongTypography text={address} displayedLines={1} />
                    </TableCell> */}
                    <TableCell>
                      {registrationType || REG_TYPE.SELF_REGISTERED}
                    </TableCell>
                    <TableCell align="center">{familyMembers}</TableCell>

                    <TableCell align="center">
                      <Tooltip title="View Medical Records">
                        <IconButton
                          size="small"
                          // onClick={() => handleViewMedicalRecord(id)}
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

      {createAccountModal.open && (
        <CreateAccountModal
          open={createAccountModal.open}
          onClose={handleAccountModalClose}
          onCreate={handleCreate}
        />
      )}
    </AdminMainContainer>
  );
};

export default PatientListPage;
