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
  addBranchReq,
  deleteBranchReq,
  getBranchesReq,
  getServicesReq,
  omitKeys,
  saveLogReq,
  updateBranchReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import {
  Input,
  PATHS,
  Pagination,
  TableContainer,
  confirmMessage,
  successMessage,
} from "../../../common";
import { AdminMainContainer } from "../../../shared";
import ManageBranchModal from "./ManageBranchModal";
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const BranchManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
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
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

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
          ...lodash.pick(i, ["name", "id"]),
        }))
      );
      setServicesMap(serviceMap);
    };

    const fetchBranches = async () => {
      // Get Branches
      const { data: branchList, error: getBranchError } = await getBranches({
        mapService: false,
      });
      if (getBranchError) return openErrorDialog(getBranchError);

      setBranches(branchList);
    };

    fetchServices();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(branches);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branches]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleAddBranch = async (docs) => {
    // Add
    const { data: newDocs, error: addError } = await addBranch({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.CREATE,
      resourceType: RESOURCE_TYPE.BRANCH,
      resourceId: newDocs.map((i) => i.id),
      resourceName: newDocs.map((i) => i.name),
      change: null,
    });

    // Successful
    setBranches((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Branch", newDocs.length, "es"),
        verb: "added",
      }),
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

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.UPDATE,
      resourceType: RESOURCE_TYPE.BRANCH,
      resourceId: updatedBranch.id,
      resourceName: updatedBranch.name,
      change: omitKeys(updates, RESOURCE_TYPE.BRANCH),
    });

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

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.DELETE,
      resourceType: RESOURCE_TYPE.BRANCH,
      resourceId: branch.id,
      resourceName: branch.name,
      change: null,
    });

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
        paths: [{ text: "Branches" }],
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
                { text: "Capacity", align: "center", sx: { width: 110 } },
                { text: "Address", sx: { width: 400 } },
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
                const data = {
                  ...i,
                  services: i.servicesId.map((s) => servicesMap[s]),
                };
                return (
                  <TableRow key={i.id}>
                    <TableCells data={data} />
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditBranchModalOpen(data)}
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
