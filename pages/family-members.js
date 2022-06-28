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

import FamilyMemberForm from "../components/FamilyMemberForm";
import { useAuth } from "../contexts/AuthContext";
import { useBackdropLoader } from "../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../contexts/ResponseDialogContext";
import useRequest from "../hooks/useRequest";
import { addFamilyMembersReq, getFamilyMembersReq } from "../modules/firebase";
import { formatDate, getInitials } from "../modules/helper";

const FamilyMemberPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog } = useResponseDialog();
  const [getFamilyMembers] = useRequest(getFamilyMembersReq, setBackdropLoader);
  const [addFamilyMembers] = useRequest(addFamilyMembersReq, setBackdropLoader);

  const [members, setMembers] = useState([]);
  const [familyMemberModalOpen, setFamilyMemberModalOpen] = useState(false);

  useEffect(() => {
    if (user.id) {
      getFamilyMembers(user.id, {
        successCb(members) {
          setMembers(members);
        },
        errorCb(error) {
          openResponseDialog({
            content: error,
            type: "WARNING",
          });
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

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
          openResponseDialog({
            content: error,
            type: "WARNING",
          });
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
            const toBeVerified = !verified && !verificationAttachment;

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
                        {toBeVerified && (
                          <IconButton size="small">
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
                        {verified ? (
                          <>
                            <IconButton
                              size="small"
                              sx={{ pointerEvents: "none" }}
                            >
                              <VerifiedUserIcon color="success" />
                            </IconButton>
                            Verified
                          </>
                        ) : toBeVerified ? (
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
                            {" "}
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
    </>
  );
};

export default FamilyMemberPage;
