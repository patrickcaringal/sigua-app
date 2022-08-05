import React, { useEffect, useState } from "react";

import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { Toolbar, successMessage } from "../../../../components/common";
import { MobileNumberVerificationModal } from "../../../../components/shared";
import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addFamilyMembersReq,
  addPatientReq,
  getFamilyMembersReq,
  updateFamilyMembersReq,
  updatePatientReq,
  uploadImageReq,
} from "../../../../modules/firebase";
import {
  compareObj,
  formatTimeStamp,
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import Cards from "./Cards";
import ManageFamilyMemberModal from "./ManageFamilyMemberModal";
import UploadAttachmentModal from "./UploadAttachmentModal";
import { MEMBER_STATUS, icons, statusUploadAllowed } from "./utils";

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
  const [addFamilyMembers] = useRequest(addPatientReq, setBackdropLoader);
  const [uploadImage] = useRequest(uploadImageReq);
  const [updateFamilyMember] = useRequest(updatePatientReq, setBackdropLoader);

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

  const handleAddMemeber = async (docs) => {
    docs = docs.map((i) => ({ ...i, accountId: user.id }));

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
        setFamilyMemberModal(defaultModal);
      },
    });
  };

  const handleEditMemeber = async (updatedDocs) => {
    const updatedPatient = {
      ...updatedDocs[0],
      ...personBuiltInFields(updatedDocs[0]),
    };
    const membersCopy = [...members];
    const index = membersCopy.findIndex((i) => i.id === updatedPatient.id);

    const { diff } = compareObj({
      latest: updatedPatient,
      old: membersCopy[index],
      fields: Object.keys(members[index]),
      retainFields: ["id"],
    });

    const updates = {
      ...diff,
      ...(diff.contactNo && { verifiedContactNo: false }),
    };

    membersCopy[index] = {
      ...membersCopy[index],
      ...updates,
    };

    // Update
    const { error: updateError } = await updateFamilyMember({
      patient: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setMembers(membersCopy);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Family member", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setFamilyMemberModal(defaultModal);
      },
    });
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
    const membersCopy = [...members];
    const index = membersCopy.findIndex(
      (i) => i.id === verificationModal.data.id
    );

    const updates = {
      id: verificationModal.data.id,
      verificationAttachment: url,
      verificationRejectReason: null,
    };

    membersCopy[index] = {
      ...membersCopy[index],
      ...updates,
    };

    const { error: updateError } = await updateFamilyMember({
      patient: updates,
    });
    if (updateError) {
      setBackdropLoader(false);
      return openErrorDialog(updateError);
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

  const handleMemberModalOpen = () => {
    setFamilyMemberModal({
      open: true,
      data: null,
    });
  };

  const handleEditModalOpen = (member) => {
    setFamilyMemberModal({
      open: true,
      data: { ...member, birthdate: formatTimeStamp(member.birthdate) },
    });
  };

  const handleAttachmentModalOpen = (member) => {
    setVerificationModal({
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

  const handleAttachmentModalClose = () => {
    setVerificationModal(defaultModal);
  };

  const handlePhoneModalClose = () => {
    setPhoneModal(defaultModal);
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
          onEditModal={handleEditModalOpen}
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
