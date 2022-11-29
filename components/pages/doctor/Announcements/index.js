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
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { usePagination, useRequest } from "../../../../hooks";
import {
  LOG_ACTIONS,
  RESOURCE_TYPE,
  addAnnouncementReq,
  deleteAnnouncementReq,
  getAnnouncementsReq,
  omitKeys,
  saveLogReq,
  updateAnnouncementReq,
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
import AnnouncementModal from "./AnnouncementModal";
import TableCells from "./TableCells";
import useFilter from "./useFilter";

const defaultModal = {
  open: false,
  data: {},
};

const AnnouncementsManagementPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getAnnouncements] = useRequest(getAnnouncementsReq, setBackdropLoader);
  const [addAnnouncement] = useRequest(addAnnouncementReq, setBackdropLoader);
  const [updateAnnouncement] = useRequest(
    updateAnnouncementReq,
    setBackdropLoader
  );
  const [deleteAnnouncement] = useRequest(
    deleteAnnouncementReq,
    setBackdropLoader
  );

  // Local States
  const [announcements, setAnnouncements] = useState([]);
  const [announcementModal, setAnnouncementModal] = useState(false);
  const filtering = useFilter({});
  const pagination = usePagination(filtering.filtered);

  useEffect(() => {
    const fetch = async () => {
      // Get Announcement
      const { data, error } = await getAnnouncements();
      if (error) return openErrorDialog(error);

      setAnnouncements(data);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filtering.setData(announcements);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [announcements]);

  useEffect(() => {
    pagination.setTotalItems(filtering.filtered.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtering.filtered.length]);

  const handleAddAnnouncement = async (docs) => {
    // Add
    const { data: newDocs, error: addError } = await addAnnouncement({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.CREATE,
      resourceType: RESOURCE_TYPE.ANNOUNCEMENT,
      resourceId: newDocs.map((i) => i.id),
      resourceName: newDocs.map((i) => i.title),
      change: null,
    });

    // Successful
    setAnnouncements((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: successMessage({
        noun: pluralize("Announcement", newDocs.length),
        verb: "added",
      }),
      type: "SUCCESS",
      closeCb() {
        setAnnouncementModal(defaultModal);
      },
    });
  };

  const handleEditAnnouncement = async (updatedDocs) => {
    const updatedAnnouncement = updatedDocs[0];
    const announcementCopy = [...announcements];
    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedAnnouncement,
      oldDocs: announcementCopy,
    });

    // Update
    const { error: updateError } = await updateAnnouncement({
      announcement: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.UPDATE,
      resourceType: RESOURCE_TYPE.ANNOUNCEMENT,
      resourceId: updatedAnnouncement.id,
      resourceName: updatedAnnouncement.title,
      change: omitKeys(updates, RESOURCE_TYPE.ANNOUNCEMENT),
    });

    // Success
    setAnnouncements(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Announcement", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setAnnouncementModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (announcement) => {
    openResponseDialog({
      content: confirmMessage({
        noun: "Announcement",
        item: announcement.name,
      }),
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(announcement)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (announcement) => {
    // Delete
    const { error: deleteError } = await deleteAnnouncement({ announcement });
    if (deleteError) return openErrorDialog(deleteError);

    await saveLogReq({
      actorId: user.id,
      actorName: user.name,
      action: LOG_ACTIONS.DELETE,
      resourceType: RESOURCE_TYPE.ANNOUNCEMENT,
      resourceId: announcement.id,
      resourceName: announcement.title,
      change: null,
    });

    // Success
    setAnnouncements((prev) => prev.filter((i) => i.id !== announcement.id));
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Announcement", verb: "deleted" }),
      type: "SUCCESS",
    });
  };

  const handleAnnouncementModalOpen = () => {
    setAnnouncementModal({
      open: true,
      data: null,
    });
  };

  const handleAnnouncementModalClose = () => {
    setAnnouncementModal(defaultModal);
  };

  const handleEditAnnouncementModalOpen = (announcement) => {
    setAnnouncementModal({
      open: true,
      data: announcement,
    });
  };

  const handleRestoreRedirect = () => {
    router.push(PATHS.DOCTOR.ANNOUNCEMENT_RESTORE);
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
        paths: [{ text: "Announcements" }],
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
            onClick={handleAnnouncementModalOpen}
            startIcon={<AddCircleIcon />}
          >
            add announcement
          </Button>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Title", sx: { width: 200 } },
                { text: "Content" },
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
                return (
                  <TableRow key={i.id}>
                    <TableCells data={i} />
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditAnnouncementModalOpen(i)}
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

      {announcementModal.open && (
        <AnnouncementModal
          open={announcementModal.open}
          data={announcementModal.data}
          onClose={handleAnnouncementModalClose}
          onSave={
            !announcementModal.data
              ? handleAddAnnouncement
              : handleEditAnnouncement
          }
        />
      )}
    </AdminMainContainer>
  );
};

export default AnnouncementsManagementPage;
