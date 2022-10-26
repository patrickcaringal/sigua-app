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
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  REG_TYPE,
  addPatientReq,
  getAccountsReq,
} from "../../../../modules/firebase";
import {
  calculateAge,
  formatTimeStamp,
  personBuiltInFields,
} from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  Input,
  LongTypography,
  PATHS,
  Pagination,
  TableContainer,
  getActionButtons,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import CreateAccountModal from "./CreateAccountModal";
import FamilyModal from "./FamilyModal";
import ManageFamilyMemberModal from "./ManageFamilyMemberModal";

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
  const [addFamilyMembers] = useRequest(addPatientReq, setBackdropLoader);

  // Local States
  const [familyMemberModal, setFamilyMemberModal] = useState(defaultModal);
  const [createAccountModal, setCreateAccountModal] = useState(defaultModal); // Phone Verification Modal
  const [familyModal, setFamilyModal] = useState(defaultModal); // Family Modal
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

  const handleCreate = (newDocs) => {
    setPatients((prev) => [...prev, ...newDocs]);
  };

  const handleAddMember = (patientId) => {
    const copy = [...patients];
    const idx = copy.findIndex((i) => i.id === patientId);

    copy[idx].familyMembers += 1;

    setPatients(copy);
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

  const handleFamilyModalOpen = (id) => {
    setFamilyModal({
      open: true,
      data: id,
    });
  };

  const handleFamilyModalClose = () => {
    setFamilyModal(defaultModal);
  };

  const handleMemberModalOpen = (id) => {
    setFamilyMemberModal({
      open: true,
      data: { accountId: id },
    });
  };

  const handleEditModalOpen = (member) => {
    setFamilyMemberModal({
      open: true,
      data: { ...member, birthdate: formatTimeStamp(member.birthdate) },
    });
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
                      {/* <Tooltip title="View Medical Records">
                        <IconButton
                          size="small"
                          // onClick={() => handleViewMedicalRecord(id)}
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </Tooltip> */}
                      {getActionButtons([
                        {
                          action: ACTION_BUTTONS.VIEW_FAMILY_MEMBERS,
                          tooltipText: "Family Members",
                          onClick: () => handleFamilyModalOpen(id),
                        },
                        // {
                        //   action: ACTION_BUTTONS.ADD_USER,
                        //   tooltipText: "Add family Member",
                        //   onClick: () => handleMemberModalOpen(id),
                        // },
                      ])}
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

      {familyModal.open && (
        <FamilyModal
          open={familyModal.open}
          data={familyModal.data}
          onAddMember={handleAddMember}
          onClose={handleFamilyModalClose}
        />
      )}
    </AdminMainContainer>
  );
};

export default PatientListPage;
