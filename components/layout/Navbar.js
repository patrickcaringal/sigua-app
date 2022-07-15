import * as React from "react";

import AdbIcon from "@mui/icons-material/Adb";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { Logo } from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import { signOutAnonymouslyReq, signOutReq } from "../../modules/firebase";
import { getFullName, getInitials } from "../../modules/helper";

const pages = ["Products", "Pricing", "Blog"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
  const router = useRouter();
  const {
    userSession,
    user,
    manualSetUser,
    isAdmin,
    isStaff,
    isLoggedIn,
    isAdminPanel,
  } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();
  const [signOutAnonymously] = useRequest(
    signOutAnonymouslyReq,
    setBackdropLoader
  );

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    // Sign Out Doctor, Staff
    if (isAdmin || isStaff) {
      const { error: signOutError } = await signOutReq();
      if (signOutError) return openErrorDialog(signOutError);
      manualSetUser(null);
      setAnchorElUser(null);
      return;
    }

    // Sign Out Patient
    const { error: signOutError } = await signOutAnonymously(userSession);
    if (signOutError) return openErrorDialog(signOutError);
    manualSetUser(null);
    setAnchorElUser(null);
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
            {/* <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} /> */}
            <Logo width="160" height="56" />

            {/* Mobile */}
            <>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
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
              <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Sigua mobile
              </Typography>
            </>

            {/* Navbar items */}
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))} */}
            </Box>

            {/* Right */}
            <Box sx={{ flexGrow: 0 }}>
              {isLoggedIn ? (
                <>
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {getInitials(user?.firstName)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Box sx={{ width: 260, p: 2 }}>
                      <Typography variant="body1" textAlign="center">
                        {getFullName(user).toUpperCase()}
                      </Typography>
                      <Typography variant="body2" textAlign="center">
                        {user?.email}
                      </Typography>
                      <Typography
                        variant="caption"
                        textAlign="center"
                        display="block"
                      >
                        {user?.role === "superadmin"
                          ? "Doctor"
                          : !user?.role
                          ? "Patient"
                          : user?.role}
                      </Typography>
                    </Box>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : // displayed if page is not signin or signup
              !["/signin", "/signup", "/doctor/signin"].includes(
                  router.pathname
                ) ? (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/signin");
                  }}
                >
                  Sign in
                </Button>
              ) : null}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
};
export default ResponsiveAppBar;
