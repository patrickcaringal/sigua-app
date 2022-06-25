import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
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
              <Card key={index} sx={{ width: 345, height: 180 }}>
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
                  // action={
                  //   <IconButton aria-label="settings">
                  //     <MoreVertIcon />
                  //   </IconButton>
                  // }
                  title={`${firstName} ${middleName} ${lastName}`.toUpperCase()}
                  subheader="Verified"
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {contactNo} |{" "}
                    {formatDate(new Date(birthdate), "MMMM dd, yyyy")} |{" "}
                    {gender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {address}
                  </Typography>
                </CardContent>
              </Card>
            )
          )}
        </Box>
      </Container>

      <FamilyMemberForm open={open} setOpen={setOpen} />
    </>
  );
};

export default FamilyMemberPage;
