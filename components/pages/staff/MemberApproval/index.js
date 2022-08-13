import React, { useEffect, useState } from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  MEMBER_STATUS,
  deleteImageReq,
  getPatientsForApprovalReq,
  updatePatientReq,
} from "../../../../modules/firebase";
import { getFullName, localUpdateDocs } from "../../../../modules/helper";
import { Toolbar, successMessage } from "../../../common";
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

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        mx: 4,
      }}
    >
      <Toolbar
        onRootClick={() => router.push("/staff/dashboard")}
        paths={[{ text: "Member Approval" }]}
      />

      <Box>
        <Paper
          elevation={2}
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Requester</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {members.map((m, index) => {
                  const {
                    firstName,
                    suffix,
                    lastName,
                    middleName,
                    address,
                    accountName,
                  } = m;

                  return (
                    <TableRow key={index}>
                      <TableCell>
                        {getFullName({
                          firstName,
                          suffix,
                          lastName,
                          middleName,
                        })}
                      </TableCell>
                      <TableCell>{accountName}</TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: "2",
                            overflow: "hidden",
                          }}
                          component="div"
                        >
                          {address}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
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
        </Paper>
      </Box>

      {memberApprovalModal.open && (
        <MemberApprovalModal
          open={memberApprovalModal.open}
          data={memberApprovalModal.data}
          onClose={handleMemberModalClose}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </Box>
  );
};

export default MemberApprovalPage;
