import React, { useEffect, useState } from "react";

import RestoreIcon from "@mui/icons-material/Restore";
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest, useSelect } from "../../../../hooks";
import {
  getDeletedStaffsReq,
  restoreStaffReq,
} from "../../../../modules/firebase";
import { arrayStringify, pluralize } from "../../../../modules/helper";
import { PATHS, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import TableCells from "./TableCells";

const StaffsRestorePage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getStaffs] = useRequest(getDeletedStaffsReq, setBackdropLoader);
  const [restoreStaff] = useRequest(restoreStaffReq, setBackdropLoader);

  // Local States
  const [staffs, setStaffs] = useState([]);
  const selected = useSelect("id");
  const selectedItems = selected.getSelected(staffs);

  useEffect(() => {
    const fetchStaffs = async () => {
      // Get Staffs
      const { data: staffList, error: getStaffsError } = await getStaffs();
      if (getStaffsError) return openErrorDialog(getStaffsError);

      setStaffs(staffList);
    };

    fetchStaffs();
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
    const { error: restoreError } = await restoreStaff({ docs: items });
    if (restoreError) return openErrorDialog(restoreError);

    // Success
    setStaffs((prev) => prev.filter((i) => !ids.includes(i.id)));
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Staff", items.length),
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
            text: "Staffs",
            onClick: () => router.push(PATHS.DOCTOR.STAFF_MANAGEMENT),
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
                { text: "Name" },
                { text: "Email", sx: { width: 200 } },
                { text: "Birthdate", sx: { width: 140 } },
                { text: "Age", sx: { width: 40 }, align: "center" },
                { text: "Gender", sx: { width: 100 } },
                // { text: "Contact No.", sx: { width: 140 } },
                { text: "Address", sx: { width: 360 } },
                { text: "Branch", sx: { width: 110 } },
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

export default StaffsRestorePage;
