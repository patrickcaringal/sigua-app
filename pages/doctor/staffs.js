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
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import { addStaffReq } from "../../modules/firebase";

const DashboardPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const [addStaff] = useRequest(addStaffReq, setBackdropLoader);

  const [staffModalOpen, setStaffModalOpen] = useState(false);

  const handleStaffModalOpen = () => {
    setStaffModalOpen(true);
  };

  const handleCheckDuplicate = (newStaff) => {
    // return membersUniqueId.includes(newStaff);
    return false;
  };

  const handleAddStaff = async (newStaff) => {
    // Add Staff
    // const allMembers = [...members, ...newStaff];

    const { error: addStaffError } = await addStaff({
      staffs: newStaff,
    });
    if (addStaffError) return openErrorDialog(addStaffError);

    // setMembers(allMembers);
    openResponseDialog({
      autoClose: true,
      content: "Staff successfuly added.",
      type: "SUCCESS",
      closeCb() {
        setStaffModalOpen(false);
      },
    });
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
        onCheckDuplicate={handleCheckDuplicate}
        onAddStaff={handleAddStaff}
      />
    </Box>
  );
};

export default DashboardPage;
