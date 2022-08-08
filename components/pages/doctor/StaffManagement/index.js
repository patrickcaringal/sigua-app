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
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import { AdminMainContainer } from "../../../shared";
import ManageStaffModal from "./ManageStaffModal";
import TableCells from "./TableCells";

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

  const handleAddStaff = async (docs) => {
    docs = docs.map((i) => ({
      ...i,
      ...personBuiltInFields(i),
    }));

    // Add
    const { data: newDocs, error: addError } = await addStaff({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setStaffs((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: `${pluralize("Staff", newDocs.length)} successfuly added.`,
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
              {[
                { text: "Name", sx: { width: 200 } },
                { text: "Email" },
                { text: "Address", sx: { width: 400 } },
                { text: "Branch", align: "center", sx: { width: 110 } },
                { text: "Actions", align: "center", sx: { width: 110 } },
              ].map(({ text, align, sx }) => (
                <TableCell
                  key={text}
                  {...(align && { align })}
                  {...(sx && { sx: { ...sx, fontWeight: "bold" } })}
                >
                  {text}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {staffs.map((i) => {
              const { id, branch, birthdate } = i;
              const data = {
                ...i,
                branchName: branchesMap[branch],
              };

              return (
                <TableRow key={id}>
                  <TableCells data={data} />
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
