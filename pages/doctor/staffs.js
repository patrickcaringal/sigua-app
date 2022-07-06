import React, { useState } from "react";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Link,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { ManageStaffModal } from "../../components";
const DashboardPage = () => {
  const router = useRouter();

  const [staffModalOpen, setStaffModalOpen] = useState(false);

  const handleStaffModalOpen = () => {
    setStaffModalOpen(true);
  };

  return (
    <Box
      sx={{
        // bgcolor: "primary.light",
        height: "calc(100vh - 64px)",
        // display: "flex",
        // flexDirection: "column",
        // alignItems: "center",
        // justifyContent: "center",
        mx: 4,
      }}
    >
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
            <Typography color="text.primary">Staffs</Typography>
          </Breadcrumbs>
        </Box>

        <Button
          variant="contained"
          size="small"
          onClick={handleStaffModalOpen}
          startIcon={<GroupAddIcon />}
        >
          add staff
        </Button>
      </Toolbar>

      <Box
        sx={
          {
            // display: "flex",
            // flexDirection: "row",
            // flexWrap: "wrap",
            // columnGap: 2,
            // rowGap: 2,
            // my: 1,
            // border: "1px solid blue",
          }
        }
      >
        <Paper
          elevation={2}
          sx={{ p: 2, height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          content
        </Paper>
      </Box>

      <ManageStaffModal
        open={staffModalOpen}
        setOpen={setStaffModalOpen}
        // onCheckDuplicate={handleCheckDuplicate}
        // onAddMemeber={handleAddMemeber}
      />
    </Box>
  );
};

export default DashboardPage;
