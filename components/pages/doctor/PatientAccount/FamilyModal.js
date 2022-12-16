import React, { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getBaseApi } from "../../../../modules/env";
import {
  MEMBER_STATUS,
  addPatientReq,
  getFamilyMembersReq,
  updatePatientReq,
} from "../../../../modules/firebase";
import {
  calculateAge,
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  Modal,
  TableContainer,
  getActionButtons,
  successMessage,
} from "../../../common";
import { MobileNumberVerificationModal } from "../../../shared";
import { icons } from "../../patient/FamilyMembers/utils";
import ManageFamilyMemberModal from "./ManageFamilyMemberModal";
import PrintIdModal from "./PrintIdModal";

const defaultModal = {
  open: false,
  data: {},
};

const FamilyModal = ({
  open = false,
  data: patientId,
  onAddMember,
  onClose,
}) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog, openResponseDialog } = useResponseDialog();

  // Requests
  const [getFamilyMembers] = useRequest(getFamilyMembersReq, setBackdropLoader);
  const [addFamilyMembers] = useRequest(addPatientReq, setBackdropLoader);
  const [updateFamilyMember] = useRequest(updatePatientReq, setBackdropLoader);
  const [generateQRId] = useRequest(axios.post, setBackdropLoader);

  // Local States
  const [members, setMembers] = useState([]);
  const [familyMemberModal, setFamilyMemberModal] = useState(defaultModal);
  const [printIdModal, setPrintIdModal] = useState(defaultModal); // Phone Verification Modal
  const [phoneModal, setPhoneModal] = useState(defaultModal);

  useEffect(() => {
    const fetch = async () => {
      const { data, error: getError } = await getFamilyMembers(patientId);
      if (getError) return openErrorDialog(getError);

      setMembers(data);
    };

    // if (data) fetch();
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleClose = () => {
    onClose();
  };

  const handlePrintIdModalOpen = async (data) => {
    try {
      const payload = {
        id: data.id,
        name: data.name,
      };
      // payload
      const res = await generateQRId(getBaseApi("/pdf"), payload);
      setPrintIdModal({
        open: true,
        data: res?.data,
      });
    } catch (error) {
      setBackdropLoader(false);
      openErrorDialog(error?.message);
    }
  };

  const handleAddFamilyMemeber = async (docs) => {
    docs = docs.map((i) => ({
      ...i,
      verified: true,
      verifiedContactNo: true,
      verificationAttachment: null,
      verificationRejectReason: null,
      status: MEMBER_STATUS.VERFIED,
      ...personBuiltInFields(i),
    }));

    // Add
    const { data: newDocs, error: addError } = await addFamilyMembers({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setMembers((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Family member", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        onAddMember(patientId);
        setFamilyMemberModal(defaultModal);
      },
    });
  };

  const handleVerifyPhone = async (verified) => {
    if (verified) {
      setBackdropLoader(true);

      const updatedDoc = {
        id: phoneModal?.data?.id,
        verifiedContactNo: true,
        status: MEMBER_STATUS.VERFIED,
      };
      const { latestDocs, updates } = localUpdateDocs({
        updatedDoc,
        oldDocs: [...members],
      });

      // Update
      const { error: updateError } = await updateFamilyMember({
        patient: updates,
      });
      if (updateError) {
        setBackdropLoader(false);
        return openErrorDialog(updateError);
      }

      // Success
      setBackdropLoader(false);
      setMembers(latestDocs);
      openResponseDialog({
        autoClose: true,
        content: successMessage({ noun: "Contact No", verb: "verified" }),
        type: "SUCCESS",
        closeCb() {
          setPhoneModal(defaultModal);
        },
      });
    } else {
      openErrorDialog("Incorrect Verification code");
    }
  };

  const handleMemberModalOpen = () => {
    setFamilyMemberModal({
      open: true,
      data: { accountId: patientId },
    });
  };

  const handlePrintIdModalClose = () => {
    setPrintIdModal(defaultModal);
  };

  const handlePhoneModalOpen = async (member) => {
    const updatedDoc = {
      id: member?.id,
      verified: true,
      verifiedContactNo: true,
      status: MEMBER_STATUS.VERFIED,
    };

    // Update
    const { error: updateError } = await updateFamilyMember({
      patient: updatedDoc,
    });
    if (updateError) {
      setBackdropLoader(false);
      return openErrorDialog(updateError);
    }

    alert("updated");
    // setPhoneModal({
    //   open: true,
    //   data: member,
    // });
  };

  const handlePhoneModalClose = () => {
    setPhoneModal(defaultModal);
  };

  return (
    <>
      <Modal width="lg" open={open && !printIdModal.open} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
          }}
        >
          <AppBar sx={{ position: "sticky" }}>
            <Container maxWidth="lg">
              <Toolbar disableGutters>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  View Family Members
                </Typography>

                <Button color="inherit" onClick={handleMemberModalOpen}>
                  add memeber
                </Button>
                <Button color="inherit" onClick={handleClose}>
                  Close
                </Button>
              </Toolbar>
            </Container>
          </AppBar>

          <Box sx={{ py: 2, px: 4 }}>
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
                      { text: "Status", sx: { width: 200 } },
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
                  {members.map((m, index) => {
                    const { id, name, gender, birthdate, contactNo, status } =
                      m;

                    return (
                      <TableRow key={id} id={id}>
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
                          <Typography variant="body2" color="text.secondary">
                            {icons[status]}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {status === MEMBER_STATUS.VERFIED &&
                            getActionButtons([
                              {
                                action: ACTION_BUTTONS.GENERATE_QR_CODE,
                                tooltipText: "Print ID",
                                onClick: () => handlePrintIdModalOpen(m),
                              },
                            ])}
                          {status === MEMBER_STATUS.FOR_PHONE_VERIFICATION &&
                            getActionButtons([
                              {
                                action: ACTION_BUTTONS.VERIFY_MOBILE,
                                tooltipText: "Verify Mobile",
                                onClick: () => handlePhoneModalOpen(m),
                              },
                            ])}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>

      {printIdModal.open && (
        <PrintIdModal
          open={printIdModal.open}
          data={printIdModal.data}
          onClose={handlePrintIdModalClose}
        />
      )}

      {familyMemberModal.open && (
        <ManageFamilyMemberModal
          open={familyMemberModal.open}
          data={familyMemberModal.data}
          setOpen={setFamilyMemberModal}
          onSave={handleAddFamilyMemeber}
        />
      )}

      {phoneModal.open && (
        <MobileNumberVerificationModal
          open={phoneModal.open}
          data={phoneModal.data}
          onClose={handlePhoneModalClose}
          onVerify={handleVerifyPhone}
        />
      )}
    </>
  );
};

export default FamilyModal;
