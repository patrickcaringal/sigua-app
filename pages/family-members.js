import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { Toolbar } from "../components/common";
import {
  MEMBER_STATUS,
  ManageFamilyMemberModal,
  UploadAttachmentModal,
  icons,
  statusUploadAllowed,
} from "../components/pages/patient/FamilyMembers";
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
import { formatDate, getFullName, getInitials } from "../modules/helper";

const defaultFamilyMemberModal = {
  open: false,
  data: null,
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
  const [updateFamilyMemberVerification] = useRequest(updateFamilyMembersReq);

  // Local States
  const [members, setMembers] = useState([]);
  const [familyMemberModal, setFamilyMemberModal] = useState(
    defaultFamilyMemberModal
  );
  // Attachment Modal
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [attachmentModalData, setAttachmentModalData] = useState({});

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

  const handleEditMemberModalOpen = (member, index) => {
    setFamilyMemberModal({
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
        setFamilyMemberModal(defaultFamilyMemberModal);
      },
    });
  };

  const handleEditMemeber = async (updatedDocs) => {
    setBackdropLoader(true);

    const updatedMember = updatedDocs[0];
    const index = updatedMember.index;
    const membersCopy = [...members];

    membersCopy[index] = {
      ...membersCopy[index],
      ...updatedMember,
    };

    // Update
    const { error: updateFamMemberError } =
      await updateFamilyMemberVerification({
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
        setFamilyMemberModal(defaultFamilyMemberModal);
      },
    });
  };

  const handleAttachmentModalOpen = (member, index) => {
    const { firstName, lastName, middleName } = member;

    setAttachmentModalOpen(true);
    setAttachmentModalData({ index, firstName, lastName, middleName });
  };

  const handleAttachmentModalClose = () => {
    setAttachmentModalOpen(false);
    setAttachmentModalData({});
  };

  const updateMembers = (index, url) => {
    let membersCopy = [...members];
    membersCopy[index] = {
      ...membersCopy[index],
      verificationAttachment: url,
      verificationRejectReason: null,
    };

    return membersCopy;
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
    const updatedMembers = updateMembers(attachmentModalData.index, url);
    const { error: updateFamMemberError } =
      await updateFamilyMemberVerification({
        id: user.id,
        familyMembers: updatedMembers,
        hasVerificationForApproval: true,
      });
    if (updateFamMemberError) {
      setBackdropLoader(false);
      return openErrorDialog(updateFamMemberError);
    }

    setMembers(updatedMembers);
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
          columnGap: 2,
          rowGap: 2,
          mt: 1,
        }}
      >
        {members.map((i, index) => {
          const {
            firstName,
            contactNo,
            birthdate,
            address,
            gender,
            verified,
            verificationAttachment,
            verificationRejectReason,
          } = i;

          const status = verified
            ? MEMBER_STATUS.VERFIED
            : !verificationAttachment
            ? MEMBER_STATUS.FOR_VERIFICATION
            : verificationAttachment && verificationRejectReason
            ? MEMBER_STATUS.REJECTED
            : MEMBER_STATUS.FOR_APPROVAL;

          return (
            <React.Fragment key={index}>
              <Card sx={{ width: { xs: "100%", md: 345 } }}>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ bgcolor: "primary.main" }}
                      aria-label="recipe"
                    >
                      {getInitials(firstName)}
                    </Avatar>
                  }
                  action={
                    <>
                      <IconButton
                        size="small"
                        onClick={() => handleEditMemberModalOpen(i, index)}
                      >
                        <EditIcon />
                      </IconButton>
                      {statusUploadAllowed.includes(status) && (
                        <IconButton
                          size="small"
                          onClick={() => handleAttachmentModalOpen(i, index)}
                        >
                          <UploadFileIcon />
                        </IconButton>
                      )}
                    </>
                  }
                  title={getFullName(i)}
                  subheader={
                    status === MEMBER_STATUS.REJECTED ? (
                      <Tooltip
                        title={`Rejection reason: ${verificationRejectReason}`}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {icons[status]}
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        {icons[status]}
                      </Typography>
                    )
                  }
                />
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      mb: 1,
                    }}
                  >
                    {contactNo && (
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {contactNo}
                        </Typography>
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                        />
                      </>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(birthdate, "MMMM dd, yyyy")}
                    </Typography>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {gender}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {address}
                  </Typography>
                </CardContent>
              </Card>
            </React.Fragment>
          );
        })}
      </Box>

      <ManageFamilyMemberModal
        open={familyMemberModal.open}
        data={familyMemberModal.data}
        setOpen={setFamilyMemberModal}
        onSave={!familyMemberModal.data ? handleAddMemeber : handleEditMemeber}
      />

      <UploadAttachmentModal
        data={attachmentModalData}
        open={attachmentModalOpen}
        onClose={handleAttachmentModalClose}
        onUpload={handleUploadAttachment}
      />
    </Container>
  );
};

export default FamilyMemberPage;
