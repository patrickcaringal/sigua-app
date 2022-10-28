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
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import { getDoctorReq, getStaffReq } from "../../../../modules/firebase";
import { PATHS } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import Password from "./Password";
import Profile from "./Profile";

const ProfilePage = ({ mode = "doctor" }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();
  const isDoctor = mode === "doctor";

  // Requests
  const [getProfile] = useRequest(
    isDoctor ? getDoctorReq : getStaffReq,
    setBackdropLoader
  );

  // Local States
  const [selectedTab, setSelectedTab] = useState("profile");
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetch = async () => {
      const payload = { id: user.id };
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
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.STAFF.DASHBOARD),
        paths: [{ text: "Profile" }],
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "215px auto",
          gridTemplateRows: "calc(100vh - 144px) auto",
          columnGap: 3,
        }}
      >
        {/* LEFT */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid rgba(0, 0, 0, 0.12)",
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
              <Profile data={profile} onSave={handleSaveProfile} mode={mode} />
            )}

            {selectedTab === "password" && (
              <Password data={profile} onSave={handleSavePassword} />
            )}
          </Box>
        </Box>
      </Box>
    </AdminMainContainer>
  );
};

export default ProfilePage;
