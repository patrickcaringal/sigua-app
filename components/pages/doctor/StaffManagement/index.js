import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addStaffReq,
  getBranchesReq,
  getStaffsReq,
  updateStaffReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  getFullName,
  pluralize,
} from "../../../../modules/helper";
import { AdminMainContainer } from "../../../shared";
import ManageStaffModal from "./ManageStaffModal";

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
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [staffs, setStaffs] = useState([]);
  const [staffModal, setStaffModal] = useState(defaultModal);
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});

  useEffect(() => {
    const fetchStaffs = async () => {
      // Get Staffs
      const { data: staffList, error: getStaffsError } = await getStaffs({
        mapBranch: false,
      });
      if (getStaffsError) return openErrorDialog(getStaffsError);

      setStaffs(staffList);
    };

    const fetchBranches = async () => {
      // Get Branches
      const {
        data: branchList,
        map: branchMap,
        error: getBranchError,
      } = await getBranches({ mapService: false });
      if (getBranchError) return openErrorDialog(getBranchError);

      setBranches(
        branchList.map((i) => ({
          ...lodash.pick(i, ["name", "id"]),
        }))
      );
      setBranchesMap(branchMap);
    };

    fetchStaffs();
    fetchBranches();
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
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push("/doctor/dashboard"),
        paths: [{ text: "Staffs" }],
      }}
      toolbarContent={
        <Button
          variant="contained"
          size="small"
          onClick={handleStaffModalOpen}
          startIcon={<AddCircleIcon />}
        >
          add staff
        </Button>
      }
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
                  <TableCell sx={{ width: 400, maxWidth: 400 }}>
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
                      {address}
                    </Typography>
                  </TableCell>
                  <TableCell>{branchesMap[branch]}</TableCell>
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

      {staffModal.open && (
        <ManageStaffModal
          branches={branches}
          open={staffModal.open}
          data={staffModal.data}
          onClose={handleStaffModalClose}
          onSave={!staffModal.data ? handleAddStaff : handleEditStaff}
        />
      )}
    </AdminMainContainer>
  );
};

export default StaffsPage;
