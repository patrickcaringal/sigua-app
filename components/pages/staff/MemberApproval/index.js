import React, { useCallback, useEffect, useState } from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import {
  Box,
  IconButton,
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
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  MEMBER_STATUS,
  deleteImageReq,
  getPatientsForApprovalReq,
  updatePatientReq,
} from "../../../../modules/firebase";
import {
  calculateAge,
  formatTimeStamp,
  localUpdateDocs,
} from "../../../../modules/helper";
import {
  Input,
  LongTypography,
  PATHS,
  Pagination,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import MemberApprovalModal from "./MemberApprovalModal";

const MemberApprovalPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getMemberForApproval] = useRequest(
    getPatientsForApprovalReq,
    setBackdropLoader
  );
  const [updatePatient] = useRequest(updatePatientReq);
  const [deleteImage] = useRequest(deleteImageReq);

  // Local States
  const [members, setMembers] = useState([]);
  const [memberApprovalModal, setMemberApprovalModal] = useState({
    open: false,
    data: null,
  });
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const { data: patientList, error: getPatientsError } =
        await getMemberForApproval({});
      if (getPatientsError) return openErrorDialog(getPatientsError);

      setMembers(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(members);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleMemberModalOpen = (m) => {
    setMemberApprovalModal({
      open: true,
      data: m,
    });
  };

  const handleMemberModalClose = () => {
    setMemberApprovalModal({
      open: false,
      data: null,
    });
  };

  const handleApprove = async (patient) => {
    setBackdropLoader(true);
    const updatedDoc = {
      id: patient.id,
      verified: true,
      verificationAttachment: null,
      verificationRejectReason: null,
      status: MEMBER_STATUS.FOR_PHONE_VERIFICATION,
    };

    const { updates } = localUpdateDocs({
      updatedDoc,
      oldDocs: [...members],
    });

    // Update
    const { error: updateError } = await updatePatient({
      patient: updates,
    });
    if (updateError) {
      setBackdropLoader(false);
      return openErrorDialog(updateError);
    }

    // Delete Image
    const url = patient.verificationAttachment;
    const { error: deleteImageError } = await deleteImage({
      url,
    });
    if (deleteImageError) {
      setBackdropLoader(false);
      return openErrorDialog(deleteImageError);
    }

    // Success
    setBackdropLoader(false);
    setMembers((prev) => prev.filter((i) => i.id !== updatedDoc.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Family Member Verification",
        verb: "approved",
      }),
      type: "SUCCESS",
      closeCb() {
        handleMemberModalClose();
      },
    });
  };

  const handleReject = async (patient) => {
    setBackdropLoader(true);
    const updatedDoc = {
      id: patient.id,
      verificationAttachment: null,
      status: MEMBER_STATUS.REJECTED,
    };

    const { updates } = localUpdateDocs({
      updatedDoc,
      oldDocs: [...members],
      additionalDiffFields() {
        return {
          verificationRejectReason: patient.verificationRejectReason,
        };
      },
    });

    // Update
    const { error: updateError } = await updatePatient({
      patient: updates,
    });
    if (updateError) {
      setBackdropLoader(false);
      return openErrorDialog(updateError);
    }

    // Delete Image
    const url = patient.verificationAttachment;
    const { error: deleteImageError } = await deleteImage({
      url,
    });
    if (deleteImageError) {
      setBackdropLoader(false);
      return openErrorDialog(deleteImageError);
    }

    // Success
    setBackdropLoader(false);
    setMembers((prev) => prev.filter((i) => i.id !== updatedDoc.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: "Family Member Verification",
        verb: "rejected",
      }),
      type: "SUCCESS",
      closeCb() {
        handleMemberModalClose();
      },
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
                { text: "Requester" },
                { text: "Birthdate", sx: { width: 140 } },
                { text: "Age", sx: { width: 40 }, align: "center" },
                { text: "Gender", sx: { width: 100 } },
                { text: "Contact No.", sx: { width: 140 } },
                { text: "Address", sx: { width: 360 } },
                { text: "Actions", sx: { width: 82 } },
              ].map(({ text, align, sx = {} }) => (
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
                  name,
                  gender,
                  birthdate,
                  contactNo,
                  accountName,
                  address,
                } = m;

                return (
                  <TableRow key={index}>
                    <TableCell>{name}</TableCell>
                    <TableCell>{accountName}</TableCell>
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
                    <TableCell sx={{ maxWidth: 300, height: 53 }}>
                      <LongTypography text={address} displayedLines={1} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component="span"
                        onClick={() => handleMemberModalOpen(m)}
                      >
                        <FactCheckIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination pagination={pagination} onChange={handlePageChange} />

      {memberApprovalModal.open && (
        <MemberApprovalModal
          open={memberApprovalModal.open}
          data={memberApprovalModal.data}
          onClose={handleMemberModalClose}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </AdminMainContainer>
  );
};

export default MemberApprovalPage;
