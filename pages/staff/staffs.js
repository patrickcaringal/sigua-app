import React, { useEffect, useState } from "react";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MailIcon from "@mui/icons-material/Mail";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  IconButton,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { ManageStaffModal } from "../../components";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import { addStaffReq, getStaffsReq } from "../../modules/firebase";
import { getFullName, getUniquePersonId } from "../../modules/helper";
const LOCAL_MODE = false;

const DashboardPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const [getStaffs] = useRequest(getStaffsReq, setBackdropLoader);
  const [addStaff] = useRequest(addStaffReq);

  const [staffs, setStaffs] = useState(
    LOCAL_MODE
      ? [
          {
            id: "HqOIh50XFGWgTYFE0aFU",
            gender: "female",
            suffix: "",
            lastName: "JISOO",
            birthdate: "1997-07-10",
            email: "soya@gmail.com",
            role: "staff",
            middleName: "SOYA",
            branch: "LAKESIDE",
            firstName: "KIM",
            address:
              "BLK 12 LOT 19 DON ONOFRE VILLAGE, BRGY. BANAY-BANAY, CABUYAO CITY, LAGUNA",
          },
        ]
      : []
  );
  const [staffModalOpen, setStaffModalOpen] = useState(false);

  const staffsUniqueId = staffs.map((i) => {
    const { firstName, middleName, lastName, birthdate } = i;
    const m = getUniquePersonId({ firstName, middleName, lastName, birthdate });
    return m;
  });

  useEffect(() => {
    if (LOCAL_MODE) return;

    const fetch = async () => {
      // Get Staffs
      const { data: staffList, error: getStaffsError } = await getStaffs({
        branch: "LAKESIDE",
      });
      if (getStaffsError) return openErrorDialog(getStaffsError);

      setStaffs(staffList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStaffModalOpen = () => {
    setStaffModalOpen(true);
  };

  const handleCheckDuplicate = (newStaff) => staffsUniqueId.includes(newStaff);

  const handleAddStaff = async (newStaff) => {
    // Add Staff
    const { error: addStaffError } = await addStaff({
      staffs: newStaff,
    });
    if (addStaffError) return openErrorDialog(addStaffError);

    // Successful
    const allStaffs = [...staffs, ...newStaff];
    setStaffs(allStaffs);

    openResponseDialog({
      autoClose: true,
      content: "Staff successfuly added.",
      type: "SUCCESS",
      closeCb() {
        setStaffModalOpen(false);
      },
    });
  };

  const handleSendEmail = () => {};

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
                router.push("/doctor/dashboard");
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
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Branch</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {staffs.map(
                  ({
                    id,
                    firstName,
                    suffix,
                    lastName,
                    middleName,
                    email,
                    branch,
                    address,
                  }) => (
                    <TableRow key={id}>
                      <TableCell>
                        {getFullName({
                          firstName,
                          suffix,
                          lastName,
                          middleName,
                        })}
                      </TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell sx={{ maxWidth: 160 }}>{address}</TableCell>
                      <TableCell>{branch}</TableCell>
                      <TableCell>
                        {/* <IconButton
                          color="primary"
                          component="span"
                          onClick={handleSendEmail}
                        >
                          <MailIcon />
                        </IconButton> */}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
