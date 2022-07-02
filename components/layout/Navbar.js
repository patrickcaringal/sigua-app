import * as React from "react";

import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  CssBaseline,
  IconButton,
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
import { getInitials } from "../../modules/helper";

const pages = ["Products", "Pricing", "Blog"];
// const settings = ["Profile", "Account", "Dashboard", "Logout"];

const ResponsiveAppBar = () => {
  const router = useRouter();
  const { userSession, user, manualSetUser, isAdmin, isLoggedIn } = useAuth();
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
    if (isAdmin) {
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
        color="default"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Container maxWidth={isAdmin ? "xl" : "lg"}>
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
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {getInitials(user?.firstName)}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
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
                    <MenuItem onClick={handleLogout}>
                      <Typography textAlign="center">Logout</Typography>
                    </MenuItem>
                    {/* {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))} */}
                  </Menu>
                </>
              ) : // displayed if page is not signin or signup
              !["/signin", "/signup", "/doctor/signin"].includes(
                  router.pathname
                ) ? (
                <Button
                  color="inherit"
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
