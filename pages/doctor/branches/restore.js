import React, { useEffect, useState } from "react";

import RestoreIcon from "@mui/icons-material/Restore";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { PATHS, successMessage } from "../../../components/common";
import { AdminMainContainer } from "../../../components/shared";
import { useBackdropLoader } from "../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../contexts/ResponseDialogContext";
import { useRequest, useSelect } from "../../../hooks";
import {
  getDeletedBranchesReq,
  getServicesReq,
  restoreBranchReq,
  restoreServiceReq,
} from "../../../modules/firebase";
import { arrayStringify, pluralize } from "../../../modules/helper";

const BranchesRestorePage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getBranches] = useRequest(getDeletedBranchesReq, setBackdropLoader);
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [restoreBranch] = useRequest(restoreBranchReq, setBackdropLoader);

  // Local States
  const [branches, setBranches] = useState([]);
  const [servicesMap, setServicesMap] = useState({});
  const selected = useSelect("id");
  const selectedItems = selected.getSelected(branches);

  useEffect(() => {
    const fetchServices = async () => {
      // Get Services
      const { map: serviceMap, error: getServiceError } = await getServices();
      if (getServiceError) return openErrorDialog(getServiceError);

      setServicesMap(serviceMap);
    };

    const fetchBranches = async () => {
      // Get Services
      const { data: branchList, error: getBranchesError } = await getBranches();
      if (getBranchesError) return openErrorDialog(getBranchesError);

      setBranches(branchList);
    };

    fetchServices();
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestoreConfirm = () => {
    const names = selectedItems.map((i) => i.name);
    openResponseDialog({
      content: (
        <>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to restore ff:
          </Typography>
          <Typography variant="body2">{arrayStringify(names)}</Typography>
        </>
      ),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={handleRestore}
          size="small"
        >
          restore
        </Button>
      ),
    });
  };

  const handleRestore = async () => {
    const items = selectedItems;
    const ids = selectedItems.map((i) => i.id);

    // Update
    const { error: restoreError } = await restoreBranch({ docs: items });
    if (restoreError) return openErrorDialog(restoreError);

    // Success
    setBranches((prev) => prev.filter((i) => !ids.includes(i.id)));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Branch", items.length),
        verb: "restored",
      }),
      type: "SUCCESS",
    });
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [
          {
            text: "Branches",
            onClick: () => router.push(PATHS.DOCTOR.BRANCH_MANAGEMENT),
          },
          { text: "Restore" },
        ],
      }}
      toolbarContent={
        <Button
          variant="contained"
          size="small"
          onClick={handleRestoreConfirm}
          startIcon={<RestoreIcon />}
          disabled={selectedItems.length === 0}
        >
          restore
        </Button>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {["Branch", "Services", "Address", "Capacity"].map((i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {i}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {branches.map((i) => {
              const { id, name, address, capacity, services } = i;
              const isItemSelected = selected.isItemSelected(id);

              return (
                <TableRow key={id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      // indeterminate={numSelected > 0 && numSelected < rowCount}
                      checked={isItemSelected}
                      onChange={(e) => {
                        selected.select([{ id, checked: e.target.checked }]);
                      }}
                    />
                  </TableCell>
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
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </AdminMainContainer>
  );
};

export default BranchesRestorePage;
