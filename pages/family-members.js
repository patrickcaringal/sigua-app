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
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Divider,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from "@mui/material";
import { format as formatDate } from "date-fns";

import FamilyMemberForm from "../components/FamilyMemberForm";
import { useAuth } from "../contexts/AuthContext";
import { useBackdropLoader } from "../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../contexts/ResponseDialogContext";
import useRequest from "../hooks/useRequest";
import { getFamilyMembersReq } from "../modules/firebase";

const FamilyMemberPage = () => {
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog } = useResponseDialog();
  const [getFamilyMembers] = useRequest(getFamilyMembersReq, setBackdropLoader);

  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);

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
    // TODO: create helper
    const m = `${firstName} ${middleName} ${lastName} ${formatDate(
      new Date(birthdate),
      "yyyy-MM-dd"
    )}`.toUpperCase();

    return m;
  });

  const handleMemberModalOpen = () => {
    setOpen(true);
  };

  const checkDuplicate = (newMember) => membersUniqueId.includes(newMember);

  return (
    <>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1 }}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link underline="hover" color="inherit" href="/">
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
            // bgcolor: "primary.light",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            columnGap: 2,
            rowGap: 2,
            py: 2,
          }}
        >
          {members.map(
            (
              {
                firstName,
                lastName,
                middleName,
                contactNo,
                birthdate,
                address,
                gender,
              },
              index
            ) => (
              // , height: 180
              <React.Fragment key={index}>
                <Card sx={{ width: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: "primary.main" }}
                        aria-label="recipe"
                      >
                        {/* TODO: helper for getting initial */}
                        {firstName.toUpperCase().charAt(0)}
                      </Avatar>
                    }
                    action={
                      <>
                        <IconButton size="small">
                          <VerifiedUserIcon color="success" />
                        </IconButton>
                      </>
                    }
                    title={`${firstName} ${middleName} ${lastName}`.toUpperCase()}
                    // subheader={}
                  />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {contactNo}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(new Date(birthdate), "MMMM dd, yyyy")}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {gender}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {address}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </CardActions>
                </Card>
                {/* <Card key={index} sx={{ width: 345 }}>
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{ bgcolor: "primary.main" }}
                        aria-label="recipe"
                      >
                        {firstName.toUpperCase().charAt(0)}
                      </Avatar>
                    }
                    action={
                      <>
                        <IconButton size="small">
                          <FlakyIcon />
                        </IconButton>
                      </>
                    }
                    title={`${firstName} ${middleName} ${lastName}`.toUpperCase()}
                  />
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        disableGutters
                      >
                        {contactNo}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(new Date(birthdate), "MMMM dd, yyyy")}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {gender}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {address}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small">
                      <UploadFileIcon />
                    </IconButton>
                  </CardActions>
                </Card> */}
              </React.Fragment>
            )
          )}
        </Box>
      </Container>

      <FamilyMemberForm
        open={open}
        setOpen={setOpen}
        checkDuplicate={checkDuplicate}
      />
    </>
  );
};

export default FamilyMemberPage;
