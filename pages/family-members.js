import React, { useEffect, useState } from "react";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { Toolbar } from "../components/common";
import {
  Cards,
  ManageFamilyMemberModal,
  UploadAttachmentModal,
} from "../components/pages/patient/FamilyMembers";
import { MobileNumberVerificationModal } from "../components/shared";
import { useAuth } from "../contexts/AuthContext";
import { useBackdropLoader } from "../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../contexts/ResponseDialogContext";
import useRequest from "../hooks/useRequest";
import {
  addFamilyMembersReq,
  getFamilyMembersReq,
  updateFamilyMembersReq,
  uploadImageReq,
} from "../modules/firebase";

const defaultModal = {
  open: false,
  data: {},
};

const FamilyMemberPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getFamilyMembers] = useRequest(getFamilyMembersReq, setBackdropLoader);
  const [addFamilyMembers] = useRequest(addFamilyMembersReq, setBackdropLoader);
  const [uploadImage] = useRequest(uploadImageReq);
  const [updateFamilyMember] = useRequest(updateFamilyMembersReq);

  // Local States
  const [members, setMembers] = useState([]);
  const [familyMemberModal, setFamilyMemberModal] = useState(defaultModal);
  // Attachment Modal
  const [verificationModal, setVerificationModal] = useState(defaultModal);
  // Phone Verification Modal
  const [phoneModal, setPhoneModal] = useState(defaultModal);

  useEffect(() => {
    const fetch = async () => {
      // Get Family Members
      const { data: members, error: getFamError } = await getFamilyMembers(
        user.id
      );
      if (getFamError) return openErrorDialog(getFamError);

      setMembers(members);
    };

    if (user.id) fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const handleMemberModalOpen = () => {
    setFamilyMemberModal({
      open: true,
      data: null,
    });
  };

  const handleEditMemberModalOpen = (member) => {
    setFamilyMemberModal({
      open: true,
      data: member,
    });
  };

  const handlePhoneModalOpen = (member) => {
    setPhoneModal({
      open: true,
      data: member,
    });
  };

  const handleAddMemeber = async (newMembers) => {
    // Add
    const { data: addedMembers, error: addFamMemberError } =
      await addFamilyMembers({
        id: user.id,
        familyMembers: newMembers,
      });
    if (addFamMemberError) return openErrorDialog(addFamMemberError);

    // Successful
    setMembers((prev) => [...prev, ...addedMembers]);
    openResponseDialog({
      autoClose: true,
      content: "Family members successfuly added.",
      type: "SUCCESS",
      closeCb() {
        setFamilyMemberModal(defaultModal);
      },
    });
  };

  const handleEditMemeber = async (updatedDocs) => {
    setBackdropLoader(true);

    const updatedMember = updatedDocs[0];
    const index = updatedMember.index;
    const membersCopy = [...members];

    const isContactUpdated =
      membersCopy[index].contactNo !== updatedMember.contactNo;

    membersCopy[index] = {
      ...membersCopy[index],
      ...updatedMember,
      ...(isContactUpdated && { verifiedContactNo: false }),
    };

    // Update
    const { error: updateFamMemberError } = await updateFamilyMember({
      id: user.id,
      familyMembers: membersCopy,
    });

    if (updateFamMemberError) {
      setBackdropLoader(false);
      return openErrorDialog(updateFamMemberError);
    }

    // Success
    setBackdropLoader(false);
    setMembers(membersCopy);
    openResponseDialog({
      autoClose: true,
      content: "Family member successfuly updated.",
      type: "SUCCESS",
      closeCb() {
        setFamilyMemberModal(defaultModal);
      },
    });
  };

  const handleAttachmentModalOpen = (member) => {
    const { firstName, lastName, middleName, index } = member;
    setVerificationModal({
      open: true,
      data: { index, firstName, lastName, middleName },
    });
  };

  const handleAttachmentModalClose = () => {
    setVerificationModal(defaultModal);
  };

  const handlePhoneModalClose = () => {
    setPhoneModal(defaultModal);
  };

  const handleUploadAttachment = async (file) => {
    setBackdropLoader(true);

    // Upload
    const { data: url, error: uploadError } = await uploadImage({ file });
    if (uploadError) {
      setBackdropLoader(false);
      return openErrorDialog(uploadError);
    }

    // Update
    const index = verificationModal.data.index;
    const membersCopy = [...members];
    membersCopy[index] = {
      ...membersCopy[index],
      verificationAttachment: url,
      verificationRejectReason: null,
    };

    const { error: updateFamMemberError } = await updateFamilyMember({
      id: user.id,
      familyMembers: membersCopy,
      hasVerificationForApproval: true,
    });
    if (updateFamMemberError) {
      setBackdropLoader(false);
      return openErrorDialog(updateFamMemberError);
    }

    // Success
    setMembers(membersCopy);
    setBackdropLoader(false);
    openResponseDialog({
      autoClose: true,
      content: (
        <>
          <Typography>Verification Attachment uploaded.</Typography>
          <Typography>For Staff approval</Typography>
        </>
      ),
      type: "SUCCESS",
      closeCb() {
        handleAttachmentModalClose();
      },
    });
  };

  const handleVerifyPhone = async (member) => {
    const { code } = member;

    // TODO: Verify code legit
    if (code === "1234") {
      setBackdropLoader(true);

      const index = member.index;
      const membersCopy = [...members];

      membersCopy[index] = {
        ...membersCopy[index],
        verifiedContactNo: true,
      };

      // Update
      const { error: updateFamMemberError } = await updateFamilyMember({
        id: user.id,
        familyMembers: membersCopy,
      });
      if (updateFamMemberError) {
        setBackdropLoader(false);
        return openErrorDialog(updateFamMemberError);
      }

      // Success
      setBackdropLoader(false);
      setMembers(membersCopy);
      openResponseDialog({
        autoClose: true,
        content: "Contact No successfuly verified.",
        type: "SUCCESS",
        closeCb() {
          setPhoneModal(defaultModal);
        },
      });
    } else {
      openErrorDialog("Incorrect Verification code");
    }
  };

  return (
    <Container maxWidth="lg">
      <Toolbar
        onRootClick={() => router.push("/dashboard")}
        paths={[{ text: "Family Members" }]}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleMemberModalOpen}
        >
          Add Family Member
        </Button>
      </Toolbar>
      <Box
        sx={{
          display: "flex",
          flexDirection: { sx: "column", md: "row" },
          flexWrap: "wrap",
          gap: 2,
          mt: 1,
          pb: 1,
        }}
      >
        <Cards
          data={members}
          onEditModal={handleEditMemberModalOpen}
          onVerificationModal={handleAttachmentModalOpen}
          onPhoneModal={handlePhoneModalOpen}
        />
      </Box>

      {familyMemberModal.open && (
        <ManageFamilyMemberModal
          open={familyMemberModal.open}
          data={familyMemberModal.data}
          setOpen={setFamilyMemberModal}
          onSave={
            !familyMemberModal.data ? handleAddMemeber : handleEditMemeber
          }
        />
      )}

      {verificationModal.open && (
        <UploadAttachmentModal
          data={verificationModal.data}
          open={verificationModal.open}
          onClose={handleAttachmentModalClose}
          onUpload={handleUploadAttachment}
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
    </Container>
  );
};

export default FamilyMemberPage;
