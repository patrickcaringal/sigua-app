import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RestoreIcon from "@mui/icons-material/Restore";
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { omit as omitFields } from "lodash";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addBranchReq,
  deleteBranchReq,
  getBranchesReq,
  getServicesReq,
  updateBranchReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import { PATHS, confirmMessage, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import ManageBranchModal from "./ManageBranchModal";
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const BranchManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);
  const [addBranch] = useRequest(addBranchReq, setBackdropLoader);
  const [updateBranch] = useRequest(updateBranchReq, setBackdropLoader);
  const [deleteBranch] = useRequest(deleteBranchReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branchModal, setBranchModal] = useState(defaultModal);

  useEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const { data: serviceList, error: getServiceError } = await getServices();
      if (getServiceError) return openErrorDialog(getServiceError);

      setServices(
        serviceList.map((i) => ({
          ...omitFields(i, ["dateCreated", "dateUpdated", "description"]),
        }))
      );
    };

    const fetchBranches = async () => {
      // Get Branches
      const { data: branchList, error: getBranchError } = await getBranches();
      if (getBranchError) return openErrorDialog(getBranchError);

      setBranches(branchList);
    };

    fetchServices();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddBranch = async (docs) => {
    // Add
    const { data: newDocs, error: addError } = await addBranch({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setBranches((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: `${pluralize(
        "Branch",
        newDocs.length,
        "es"
      )} successfuly added.`,
      type: "SUCCESS",
      closeCb() {
        setBranchModal(defaultModal);
      },
    });
  };

  const handleEditBranch = async (updatedDocs) => {
    const updatedBranch = updatedDocs[0];
    const branchCopy = [...branches];
    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedBranch,
      oldDocs: branchCopy,
    });

    // Update
    const { error: updateError } = await updateBranch({
      branch: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setBranches(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Branch", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setBranchModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (branch) => {
    openResponseDialog({
      content: confirmMessage({ noun: "Branch", item: branch.name }),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(branch)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (branch) => {
    // Delete
    const { error: deleteError } = await deleteBranch({ branch });
    if (deleteError) return openErrorDialog(deleteError);

    // Success
    setBranches((prev) => prev.filter((i) => i.id !== branch.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Branch", verb: "deleted" }),
      type: "SUCCESS",
    });
  };

  const handleAddBranchModalOpen = () => {
    setBranchModal({
      open: true,
      data: null,
    });
  };

  const handleBranchModalClose = () => {
    setBranchModal(defaultModal);
  };

  const handleEditBranchModalOpen = (branch) => {
    setBranchModal({
      open: true,
      data: branch,
    });
  };

  const handleRestoreRedirect = () => {
    router.push(PATHS.DOCTOR.BRANCH_RESTORE);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Branches" }],
      }}
      toolbarContent={
        <>
          <Button
            variant="outlined"
            size="small"
            onClick={handleRestoreRedirect}
            startIcon={<RestoreIcon />}
            sx={{ mr: 2 }}
          >
            restore
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleAddBranchModalOpen}
            startIcon={<AddCircleIcon />}
          >
            add branch
          </Button>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Branch", sx: { width: 200 } },
                { text: "Services" },
                { text: "Address", sx: { width: 400 } },
                { text: "Capacity", align: "center", sx: { width: 110 } },
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
            {branches.map((i) => {
              return (
                <TableRow key={i.id}>
                  <TableCells data={i} />
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditBranchModalOpen(i)}
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

      {branchModal.open && (
        <ManageBranchModal
          services={services}
          open={branchModal.open}
          data={branchModal.data}
          onClose={handleBranchModalClose}
          onSave={!branchModal.data ? handleAddBranch : handleEditBranch}
        />
      )}
    </AdminMainContainer>
  );
};

export default BranchManagementPage;
