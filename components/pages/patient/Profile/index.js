import React, { useEffect, useState } from "react";

import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getAccountReq, getStaffReq } from "../../../../modules/firebase";
import { PATHS, Toolbar } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import Password from "./Password";
import Profile from "./Profile";

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getProfile] = useRequest(getAccountReq, setBackdropLoader);

  // Local States
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const payload = { id: user.id, nameBirthdate: user.nameBirthdate };
      const { data, error } = await getProfile(payload);
      if (error) return openErrorDialog(error);

      setProfile(data);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleSavePassword = () => {};

  return (
    <Container maxWidth="lg">
      <Toolbar
        onRootClick={() => router.push(PATHS.PATIENT.DASHBOARD)}
        paths={[{ text: "Profile" }]}
      />
      <Paper
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "auto", md: "215px auto" },
          gridTemplateRows: { xs: "auto", md: "calc(100vh - 144px) auto" },
          columnGap: 3,
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRight: { xs: "none", md: "1px solid rgba(0, 0, 0, 0.12)" },
            borderBottom: { xs: "1px solid rgba(0, 0, 0, 0.12)", md: "none" },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.light",
                width: 60,
                height: 60,
                fontSize: 40,
                mb: 2,
              }}
            >
              {profile.name ? profile.name.charAt(0) : "-"}
            </Avatar>

            <Typography fontWeight="medium">{profile.name}</Typography>
          </Box>

          <Box>
            <List>
              <ListItem
                disablePadding
                onClick={() => setSelectedTab("profile")}
                selected={selectedTab === "profile"}
              >
                <ListItemButton>
                  <ListItemText primary="Profile" />
                </ListItemButton>
              </ListItem>

              <ListItem
                disablePadding
                onClick={() => setSelectedTab("password")}
                selected={selectedTab === "password"}
              >
                <ListItemButton>
                  <ListItemText primary="Password" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Box>

        {/* RIGHT */}
        <Box sx={{ pr: 3 }}>
          <Box
            sx={{
              minHeight: "calc(100vh - 64px - 64px - 30px )",
              py: 5,
            }}
          >
            {selectedTab === "profile" && (
              <Profile data={profile} onSave={handleSaveProfile} />
            )}

            {selectedTab === "password" && (
              <Password data={profile} onSave={handleSavePassword} />
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
