import React, { useCallback, useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import lodash from "lodash";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useFilter, usePagination, useRequest } from "../../../../hooks";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  addStaffReq,
  deleteStaffReq,
  getBranchesReq,
  getStaffsReq,
  omitKeys,
  saveLogReq,
  updateStaffReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import {
  Input,
  PATHS,
  Pagination,
  TableContainer,
  confirmMessage,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import ManageStaffModal from "./ManageStaffModal";
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const StaffsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getStaffs] = useRequest(getStaffsReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [addStaff] = useRequest(addStaffReq, setBackdropLoader);
  const [updateStaff] = useRequest(updateStaffReq, setBackdropLoader);
  const [deleteStaff] = useRequest(deleteStaffReq, setBackdropLoader);

  // Local States
  const [staffs, setStaffs] = useState([]);
  const [staffModal, setStaffModal] = useState(defaultModal);
  const [branches, setBranches] = useState([]);
  const [branchesMap, setBranchesMap] = useState({});
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

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

  useEffect(() => {
    filtering.setData(staffs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffs]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

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

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.CREATE,
      resourceType: RESOURCE_TYPE.STAFF,
      resourceId: newDocs.map((i) => i.id),
      resourceName: newDocs.map((i) => i.name),
      change: null,
    });

    // Successful
    setStaffs((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Staff", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleEditStaff = async (updatedDocs) => {
    const updatedStaff = {
      ...updatedDocs[0],
      ...personBuiltInFields(updatedDocs[0]),
    };

    const staffCopy = [...staffs];
    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedStaff,
      oldDocs: staffCopy,
    });

    // TODO: change email
    // const isEmailUpdated = !lodash.isEqual(
    //   staffs[index].email,
    //   updatedStaff.email
    // );

    // Update
    const { error: updateError } = await updateStaff({
      staff: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.UPDATE,
      resourceType: RESOURCE_TYPE.STAFF,
      resourceId: updatedStaff.id,
      resourceName: updatedStaff.name,
      change: omitKeys(updates, RESOURCE_TYPE.STAFF),
    });

    // Success
    setStaffs(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Staff", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setStaffModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (staff) => {
    openResponseDialog({
      content: confirmMessage({ noun: "Staff", item: staff.name }),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(staff)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (staff) => {
    // Delete
    const { error: deleteError } = await deleteStaff({ staff });
    if (deleteError) return openErrorDialog(deleteError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.DELETE,
      resourceType: RESOURCE_TYPE.STAFF,
      resourceId: staff.id,
      resourceName: staff.name,
      change: null,
    });

    // Success
    setStaffs((prev) => prev.filter((i) => i.id !== staff.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Staff", verb: "deleted" }),
      type: "SUCCESS",
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

  const handleRestoreRedirect = () => {
    router.push(PATHS.DOCTOR.STAFF_RESTORE);
  };

  const handleSearchChange = useCallback(
    (e) => {
      pagination.goToPage(0);
      filtering.onNameChange(e?.target?.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pagination.goToPage, filtering.onNameChange]
  );

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Staffs" }],
      }}
      toolbarContent={
        <>
          <Box sx={{ width: 200 }}>
            <Input
              debounce
              label="Search"
              value={filtering.filters.name}
              onChange={handleSearchChange}
            />
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRestoreRedirect}
            startIcon={<RestoreIcon />}
          >
            restore
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleStaffModalOpen}
            startIcon={<AddCircleIcon />}
          >
            add staff
          </Button>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Name" },
                { text: "Email", sx: { width: 200 } },
                { text: "Birthdate", sx: { width: 140 } },
                { text: "Age", sx: { width: 40 }, align: "center" },
                { text: "Gender", sx: { width: 100 } },
                // { text: "Contact No.", sx: { width: 140 } },
                { text: "Address", sx: { width: 360 } },
                { text: "Branch", sx: { width: 110 } },
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
            {filtering.filtered
              .slice(pagination.info.start, pagination.info.end)
              .map((i) => {
                const { id, branch, birthdate } = i;
                const data = {
                  ...i,
                  branchName: branchesMap[branch],
                };

                return (
                  <TableRow key={id}>
                    <TableCells data={data} />
                    <TableCell align="center">
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
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteConfirm(i)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination pagination={pagination} onChange={handlePageChange} />

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
