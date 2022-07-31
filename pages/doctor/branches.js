import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { omit as omitFields } from "lodash";
import { useRouter } from "next/router";

import { ManageBranchModal } from "../../components/pages/doctor/BranchManagement";
import { AdminMainContainer } from "../../components/shared";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import {
  addBranchReq,
  deleteBranchReq,
  getBranchesReq,
  getServicesReq,
  updateBranchReq,
} from "../../modules/firebase";
import { pluralize } from "../../modules/helper";

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
  const [servicesMap, setServicesMap] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchModal, setBranchModal] = useState(defaultModal);

  useEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const {
        data: serviceList,
        map: serviceMap,
        error: getServiceError,
      } = await getServices();
      if (getServiceError) return openErrorDialog(getServiceError);

      setServices(
        serviceList.map((i) => ({
          ...omitFields(i, ["dateCreated", "dateUpdated", "description"]),
        }))
      );
      setServicesMap(serviceMap);
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

  const handleAddBranch = async (newBranch) => {
    // Add Branch
    const { data: addedBranch, error: addBranchError } = await addBranch({
      docs: newBranch,
    });
    if (addBranchError) return openErrorDialog(addBranchError);

    // Successful
    setBranches((prev) => [...prev, ...addedBranch]);
    openResponseDialog({
      autoClose: true,
      content: `${pluralize(
        "Branch",
        addedBranch.length,
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
    const index = branchCopy.findIndex((i) => i.id === updatedBranch.id);

    branchCopy[index] = {
      ...branchCopy[index],
      ...updatedBranch,
    };

    // Update
    const { error: updateError } = await updateBranch({
      branch: updatedBranch,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setBranches(branchCopy);
    openResponseDialog({
      autoClose: true,
      content: "Branch successfuly updated.",
      type: "SUCCESS",
      closeCb() {
        setBranchModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (branch) => {
    openResponseDialog({
      content: `Are you sure you want to delete Branch(${branch.name})`,
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
    // Update
    const { error: deleteError } = await deleteBranch({ branch });
    if (deleteError) return openErrorDialog(deleteError);

    // Success
    setBranches((prev) => prev.filter((i) => i.id !== branch.id));
    openResponseDialog({
      autoClose: true,
      content: `${branch.name} successfuly deleted.`,
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

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push("/doctor/dashboard"),
        paths: [{ text: "Branches" }],
      }}
      toolbarContent={
        <Button
          variant="contained"
          size="small"
          onClick={handleAddBranchModalOpen}
          startIcon={<AddCircleIcon />}
        >
          add branch
        </Button>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Branch", "Services", "Address", "Capacity", "Actions"].map(
                (i) => (
                  <TableCell key={i} sx={{ fontWeight: "bold" }}>
                    {i}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {branches.map((i) => {
              const { id, name, address, capacity, services } = i;

              return (
                <TableRow key={id}>
                  <TableCell>{name}</TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {services.map((s) => (
                        <Chip
                          key={s.id}
                          label={servicesMap[s.id]}
                          color="primary"
                          size="small"
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>
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
                  <TableCell>{capacity}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleEditBranchModalOpen({
                          ...i,
                          services: services.map((i) => i.name),
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
