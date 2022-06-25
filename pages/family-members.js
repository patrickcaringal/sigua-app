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
import { useRouter } from "next/router";

import FamilyMemberForm from "../components/FamilyMemberForm";
import { useAuth } from "../contexts/AuthContext";
import { getFamilyMembersReq } from "../modules/firebase";

const FamilyMemberPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await getFamilyMembersReq(user.id, {
        successCb(members) {
          setMembers(members);
        },
        errorCb(error) {
          // setError(error);
          console.log(error);
        },
      });
    }
    fetchData();
  }, [user.id]);

  const handleMemberModalOpen = () => {
    setOpen(true);
  };

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
              <>
                <Card key={index} sx={{ width: 345 }}>
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
                    {/* <Divider orientation="vertical" variant="middle" flexItem /> */}

                    <Typography variant="body2" color="text.secondary">
                      {address}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                    {/* <IconButton size="small">
                    <UploadFileIcon />
                  </IconButton> */}
                  </CardActions>
                </Card>
                <Card key={index} sx={{ width: 345 }}>
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
                          <FlakyIcon />
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
                    {/* <Divider orientation="vertical" variant="middle" flexItem /> */}

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
                </Card>
              </>
            )
          )}
        </Box>
      </Container>

      <FamilyMemberForm open={open} setOpen={setOpen} />
    </>
  );
};

export default FamilyMemberPage;
