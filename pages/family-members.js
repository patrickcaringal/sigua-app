import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import FlakyIcon from "@mui/icons-material/Flaky";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { UploadAttachmentModal } from "../components";
import FamilyMemberForm from "../components/FamilyMemberForm";
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

const MEMBER_STATUS = {
  VERFIED: "VERFIED",
  FOR_VERIFICATION: "FOR_VERIFICATION",
  FOR_APPROVAL: "FOR_APPROVAL",
};

const FamilyMemberPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const [getFamilyMembers] = useRequest(getFamilyMembersReq, setBackdropLoader);
  const [addFamilyMembers] = useRequest(addFamilyMembersReq, setBackdropLoader);
  const [uploadImage, uploadImageLoading] = useRequest(uploadImageReq);
  const [updateFamilyMembers, updateFamilyMembersLoading] = useRequest(
    updateFamilyMembersReq
  );
  const uploadLoading = uploadImageLoading || updateFamilyMembersLoading;

  const [members, setMembers] = useState([]);
  const [familyMemberModalOpen, setFamilyMemberModalOpen] = useState(false);

  // Attachment Modal
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [attachmentModalData, setAttachmentModalData] = useState({});

  useEffect(() => {
    if (user.id) {
      getFamilyMembers(user.id, {
        successCb(members) {
          setMembers(members);
        },
        errorCb(error) {
          openErrorDialog(error);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  useEffect(() => {
    if (uploadLoading) {
      setBackdropLoader(true);
    } else {
      setBackdropLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadLoading]);

  const membersUniqueId = members.map((i) => {
    const { firstName, middleName, lastName, birthdate } = i;
    const fullname = `${firstName} ${middleName} ${lastName}`;

    const m = `${fullname} ${formatDate(birthdate)}`;
    return m;
  });

  const handleMemberModalOpen = () => {
    setFamilyMemberModalOpen(true);
  };

  const handleCheckDuplicate = (newMember) => {
    return membersUniqueId.includes(newMember);
  };

  const handleAddMemeber = (newMember) => {
    const allMembers = [...members, ...newMember];

    addFamilyMembers(
      { id: user.id, familyMembers: allMembers },
      {
        successCb() {
          setMembers(allMembers);
          openResponseDialog({
            autoClose: true,
            content: "Family members successfuly added.",
            type: "SUCCESS",
            closeCb() {
              setFamilyMemberModalOpen(false);
            },
          });
        },
        errorCb(error) {
          openErrorDialog(error);
        },
      }
    );
  };

  const handleAttachmentModalOpen = (member) => {
    const { firstName, lastName, middleName } = member;

    setAttachmentModalOpen(true);
    setAttachmentModalData({ firstName, lastName, middleName });
  };

  const handleAttachmentModalClose = () => {
    setAttachmentModalOpen(false);
    setAttachmentModalData({});
  };

  const updateMembers = (member, url) => {
    const index = members.findIndex((i) => {
      return getFullName(i) === getFullName(member);
    });

    let membersCopy = [...members];
    membersCopy[index] = {
      ...membersCopy[index],
      verificationAttachment: url,
    };

    return membersCopy;
  };

  const handleUploadAttachment = (file) => {
    uploadImage(
      { file },
      {
        successCb(url) {
          // update account fam member
          const updatedMembers = updateMembers(attachmentModalData, url);
          updateFamilyMembers(
            { id: user.id, familyMembers: updatedMembers },
            {
              successCb() {
                setMembers(updatedMembers);
                openResponseDialog({
                  autoClose: true,
                  content:
                    "Verification Attachment uploaded. For Staff approval.",
                  type: "SUCCESS",
                  closeCb() {
                    handleAttachmentModalClose();
                  },
                });
              },
              errorCb(error) {
                openResponseDialog({
                  content: error,
                  type: "WARNING",
                });
              },
            }
          );
        },
        errorCb(error) {
          openErrorDialog(error);
        },
      }
    );
  };

  return (
    <>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                href="#"
                underline="hover"
                color="inherit"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/dashboard");
                }}
              >
                Home
              </Link>
              <Typography color="text.primary">Family Members</Typography>
            </Breadcrumbs>
          </Box>

          <Button variant="contained" onClick={handleMemberModalOpen}>
            Add Family Member
          </Button>
        </Toolbar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 2,
            rowGap: 2,
            py: 2,
          }}
        >
          {members.map((i, index) => {
            const {
              firstName,
              lastName,
              middleName,
              contactNo,
              birthdate,
              address,
              gender,

              verified,
              verificationAttachment,
            } = i;
            const status = verified
              ? MEMBER_STATUS.VERFIED
              : !verificationAttachment
              ? MEMBER_STATUS.FOR_VERIFICATION
              : MEMBER_STATUS.FOR_APPROVAL;

            return (
              <React.Fragment key={index}>
                <Card sx={{ width: 345 }}>
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
                        <IconButton size="small">
                          <EditIcon />
                        </IconButton>
                        {status === MEMBER_STATUS.FOR_VERIFICATION && (
                          <IconButton
                            size="small"
                            onClick={() => handleAttachmentModalOpen(i)}
                          >
                            <UploadFileIcon />
                          </IconButton>
                        )}
                      </>
                    }
                    title={`${firstName} ${middleName} ${lastName}`}
                    subheader={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ verticalAlign: "middle" }}
                      >
                        {status === MEMBER_STATUS.VERFIED ? (
                          <>
                            <IconButton
                              size="small"
                              sx={{ pointerEvents: "none" }}
                            >
                              <VerifiedUserIcon color="success" />
                            </IconButton>
                            Verified
                          </>
                        ) : status === MEMBER_STATUS.FOR_VERIFICATION ? (
                          <>
                            <IconButton
                              size="small"
                              sx={{ pointerEvents: "none" }}
                            >
                              <NoAccountsIcon color="error" />
                            </IconButton>
                            To Verifiy
                          </>
                        ) : (
                          <>
                            <IconButton
                              size="small"
                              sx={{ pointerEvents: "none" }}
                            >
                              <FlakyIcon color="warning" />
                            </IconButton>
                            For Staff Approval
                          </>
                        )}
                      </Typography>
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
      </Container>

      <FamilyMemberForm
        open={familyMemberModalOpen}
        setOpen={setFamilyMemberModalOpen}
        onCheckDuplicate={handleCheckDuplicate}
        onAddMemeber={handleAddMemeber}
      />

      <UploadAttachmentModal
        data={attachmentModalData}
        open={attachmentModalOpen}
        onClose={handleAttachmentModalClose}
        onUpload={handleUploadAttachment}
      />
    </>
  );
};

export default FamilyMemberPage;
