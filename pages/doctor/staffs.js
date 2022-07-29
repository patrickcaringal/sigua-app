import React, { useEffect, useState } from "react";

import EditIcon from "@mui/icons-material/Edit";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { Toolbar } from "../../components/common";
import { ManageStaffModal } from "../../components/pages/doctor/StaffManagement";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import {
  addStaffReq,
  getStaffsReq,
  updateStaffReq,
} from "../../modules/firebase";
import { formatTimeStamp, getFullName, pluralize } from "../../modules/helper";

const defaultModal = {
  open: false,
  data: {},
};

const StaffsPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getStaffs] = useRequest(getStaffsReq, setBackdropLoader);
  const [addStaff] = useRequest(addStaffReq, setBackdropLoader);
  const [updateStaff] = useRequest(updateStaffReq, setBackdropLoader);

  // Local States
  const [staffs, setStaffs] = useState([]);
  // const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [staffModal, setStaffModal] = useState(defaultModal);

  useEffect(() => {
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
    setStaffModal({
      open: true,
      data: null,
    });
  };

  const handleAddStaff = async (newStaff) => {
    // Add Staff
    const { data: addedStaff, error: addStaffError } = await addStaff({
      staffs: newStaff,
    });
    if (addStaffError) return openErrorDialog(addStaffError);

    // Successful
    setStaffs((prev) => [...prev, ...addedStaff]);

    openResponseDialog({
      autoClose: true,
      content: `${pluralize("Staff", addedStaff.length)} successfuly added.`,
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleEditStaff = async (updatedDocs) => {
    const updatedStaff = updatedDocs[0];
    const index = updatedStaff.index;
    const staffCopy = [...staffs];

    staffCopy[index] = {
      ...staffCopy[index],
      ...updatedStaff,
    };

    // TODO: change email
    // const isEmailUpdated = !lodash.isEqual(
    //   staffs[index].email,
    //   updatedStaff.email
    // );

    // Update
    const { error: updateError } = await updateStaff({
      staff: updatedStaff,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setStaffs(staffCopy);
    openResponseDialog({
      autoClose: true,
      content: "Staff successfuly updated.",
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleStaffModalClose = () => {
    setStaffModal(defaultModal);
  };

  const handleEditModalOpen = (staff) => {
    setStaffModal({
      open: true,
      data: staff,
    });
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        mx: 4,
      }}
    >
      <Toolbar
        onRootClick={() => router.push("/doctor/dashboard")}
        paths={[{ text: "Staffs" }]}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleStaffModalOpen}
          startIcon={<GroupAddIcon />}
        >
          add staff
        </Button>
      </Toolbar>
      <Box>
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
                {staffs.map((i) => {
                  const { id, name, email, branch, address, birthdate } = i;

                  return (
                    <TableRow key={id}>
                      <TableCell>{getFullName(i)}</TableCell>
                      <TableCell>{email}</TableCell>
                      <TableCell sx={{ width: 200, maxWidth: 200 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: "2",
                            overflow: "hidden",
                          }}
                          component="div"
                        >
                          {/* {formatTimeStamp(birthdate)} */}
                          {address}
                        </Typography>
                      </TableCell>
                      <TableCell>{branch}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleEditModalOpen({
                              ...i,
                              birthdate: formatTimeStamp(birthdate),
                            })
                          }
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {staffModal.open && (
        <ManageStaffModal
          open={staffModal.open}
          data={staffModal.data}
          onClose={handleStaffModalClose}
          onSave={!staffModal.data ? handleAddStaff : handleEditStaff}
        />
      )}
    </Box>
  );
};

export default StaffsPage;
