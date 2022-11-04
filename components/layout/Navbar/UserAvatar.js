import React from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { PATHS } from "../../../components/common/Routes";
import { getInitials } from "../../../modules/helper";

const ROLE_TEXTS = {
  superadmin: "Doctor",
  doctor: "Doctor",
  staff: "Staff",
  patient: "Patient",
};

const UserAvatar = ({ user, isStaff, onLogout }) => {
  const router = useRouter();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    onLogout();
    setAnchorElUser(null);
  };

  return (
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
          <Typography
            variant="body1"
            textAlign="center"
            sx={{ textTransform: "uppercase" }}
          >
            {user.name}
          </Typography>
          <Typography variant="body2" textAlign="center">
            {user?.email}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              mt: 1,
            }}
          >
            <Typography
              variant="body2"
              textAlign="center"
              display="block"
              sx={{ textTransform: "capitalize" }}
            >
              {ROLE_TEXTS[user.role]}
            </Typography>

            {isStaff && (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <Typography
                  variant="body2"
                  textAlign="center"
                  display="block"
                  sx={{ textTransform: "capitalize" }}
                >
                  {user.branchName}
                </Typography>
              </>
            )}
          </Box>
        </Box>
        <Divider />

        <MenuItem
          onClick={() => {
            if (["superadmin", "doctor"].includes(user.role))
              router.push(PATHS.DOCTOR.PROFILE);
            else if (["staff"].includes(user.role))
              router.push(PATHS.STAFF.PROFILE);
            else router.push(PATHS.PATIENT.PROFILE);
            handleCloseUserMenu();
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
export default UserAvatar;
