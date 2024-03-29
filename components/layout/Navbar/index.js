import * as React from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Toolbar,
} from "@mui/material";
import { useRouter } from "next/router";

import { Logo } from "../../../components";
import { useAuth } from "../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../contexts/ResponseDialogContext";
import { useScroll } from "../../../contexts/ScrollContext";
import useRequest from "../../../hooks/useRequest";
import { signOutAnonymouslyReq, signOutReq } from "../../../modules/firebase";
import UserAvatar from "./UserAvatar";

const pages = ["Products", "Pricing", "Blog"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
  const router = useRouter();
  const { onBranchScroll, onAnnouncementScroll, onFeedbackScroll } =
    useScroll();

  const {
    userSession,
    user,
    manualSetUser,
    isAdmin,
    isStaff,
    isDoctor,
    isPatient,
    isLoggedIn,
    isAdminPanel,
  } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();
  const [signOutAnonymously] = useRequest(
    signOutAnonymouslyReq,
    setBackdropLoader
  );

  const handleLogout = async () => {
    if (isPatient) {
      // Sign Out Patient
      const { error: signOutError } = await signOutAnonymously(userSession);
      if (signOutError) return openErrorDialog(signOutError);
      manualSetUser(null);
      return;
    }

    // Sign Out Doctor, Staff
    if (isAdmin || isStaff || isDoctor) {
      const { error: signOutError } = await signOutReq();
      if (signOutError) return openErrorDialog(signOutError);
      manualSetUser(null);
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "common.white",
          boxShadow:
            "0px 2px 4px -1px rgb(0, 0, 0, 0.05), 0px 4px 5px 0px rgb(0, 0, 0, 0.05), 0px 1px 10px 0px rgb(0, 0, 0, 0.05)",
        }}
      >
        <Container maxWidth={isAdminPanel ? "none" : "lg"}>
          <Toolbar disableGutters>
            {/* Left */}
            <Box sx={{ flexGrow: 1 }}>
              <Logo
                width="160"
                height="56"
                onClick={() => {
                  router.push("/");
                }}
              />
            </Box>

            {/* Mobile */}
            {/* <>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                  color: "black",
                }}
              >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">{page}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", md: "none" },
                }}
              >
                <Logo width="160" height="56" />
              </Box>
            </> */}

            {/* Right */}
            <Box sx={{ flexGrow: 0 }}>
              {isLoggedIn && (
                <UserAvatar
                  user={user}
                  isStaff={isStaff}
                  onLogout={handleLogout}
                />
              )}

              {!isLoggedIn && ["/"].includes(router.pathname) && (
                <>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onBranchScroll();
                    }}
                    sx={{ mr: 4, display: { xs: "none", md: "inline-flex" } }}
                  >
                    Branches
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onAnnouncementScroll();
                    }}
                    sx={{ mr: 4, display: { xs: "none", md: "inline-flex" } }}
                  >
                    Announcements
                  </Button>

                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      onFeedbackScroll();
                    }}
                    sx={{ mr: 4, display: { xs: "none", md: "inline-flex" } }}
                  >
                    feedbacks
                  </Button>
                </>
              )}

              {!isLoggedIn &&
                !["/signin", "/signup", "/doctor/signin"].includes(
                  router.pathname
                ) && (
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      router.push("/signin");
                    }}
                  >
                    Sign in
                  </Button>
                )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};
export default ResponsiveAppBar;
