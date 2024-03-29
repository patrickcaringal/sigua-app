import React, { useEffect, useState } from "react";

import RestoreIcon from "@mui/icons-material/Restore";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest, useSelect } from "../../../../hooks";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  getDeletedBranchesReq,
  restoreBranchReq,
  saveLogReq,
} from "../../../../modules/firebase";
import { arrayStringify, pluralize } from "../../../../modules/helper";
import { PATHS, TableContainer, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import TableCells from "./TableCells";

const BranchesRestorePage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getBranches] = useRequest(getDeletedBranchesReq, setBackdropLoader);
  const [restoreBranch] = useRequest(restoreBranchReq, setBackdropLoader);

  // Local States
  const [branches, setBranches] = useState([]);
  const selected = useSelect("id");
  const selectedItems = selected.getSelected(branches);

  useEffect(() => {
    const fetchBranches = async () => {
      // Get Branches
      const { data: branchList, error: getBranchesError } = await getBranches();
      if (getBranchesError) return openErrorDialog(getBranchesError);

      setBranches(branchList);
    };

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

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.RESTORE,
      resourceType: RESOURCE_TYPE.BRANCH,
      resourceId: ids,
      resourceName: items.map((i) => i.name),
      change: null,
    });

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
              <TableCell sx={{ width: 50 }} />
              {[
                { text: "Branch", sx: { width: 200 } },
                { text: "Services" },
                { text: "Capacity", align: "center", sx: { width: 110 } },
                { text: "Address", sx: { width: 400 } },
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
              const { id } = i;
              const isItemSelected = selected.isItemSelected(id);

              return (
                <TableRow key={id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(e) => {
                        selected.select([{ id, checked: e.target.checked }]);
                      }}
                    />
                  </TableCell>
                  <TableCells data={i} />
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
