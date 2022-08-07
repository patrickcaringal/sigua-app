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
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  addServiceReq,
  deleteServiceReq,
  getServicesReq,
  updateServiceReq,
} from "../../../../modules/firebase";
import { localUpdateDocs, pluralize } from "../../../../modules/helper";
import { PATHS, successMessage } from "../../../common";
import { AdminMainContainer } from "../../../shared";
import ManageServiceModal from "./ManageServiceModal";
import TableCells from "./TableCells";

const defaultModal = {
  open: false,
  data: {},
};

const ServicesManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [addService] = useRequest(addServiceReq, setBackdropLoader);
  const [updateService] = useRequest(updateServiceReq, setBackdropLoader);
  const [deleteService] = useRequest(deleteServiceReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  const [serviceModal, setServiceModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      // Get Services
      const { data: serviceList, error: getServicesError } =
        await getServices();
      if (getServicesError) return openErrorDialog(getServicesError);

      setServices(serviceList);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddService = async (docs) => {
    // Add
    const { data: newDocs, error: addError } = await addService({
      docs,
    });
    if (addError) return openErrorDialog(addError);

    // Successful
    setServices((prev) => [...prev, ...newDocs]);
    openResponseDialog({
      autoClose: true,
      content: `${pluralize("Service", newDocs.length)} successfuly added.`,
      type: "SUCCESS",
      closeCb() {
        setServiceModal(defaultModal);
      },
    });
  };

  const handleEditService = async (updatedDocs) => {
    const updatedService = updatedDocs[0];
    const serviceCopy = [...services];
    const { latestDocs, updates } = localUpdateDocs({
      updatedDoc: updatedService,
      oldDocs: serviceCopy,
    });

    // Update
    const { error: updateError } = await updateService({
      service: updates,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setServices(latestDocs);
    openResponseDialog({
      autoClose: true,
      content: successMessage({ noun: "Service", verb: "updated" }),
      type: "SUCCESS",
      closeCb() {
        setServiceModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (service) => {
    openResponseDialog({
      content: `Are you sure you want to delete ${service.name}.`,
      type: "CONFIRM",
      actions: (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(service)}
          size="small"
        >
          delete
        </Button>
      ),
    });
  };

  const handleDelete = async (service) => {
    // Update
    const { error: deleteError } = await deleteService({ service });
    if (deleteError) return openErrorDialog(deleteError);

    // Success
    setServices((prev) => prev.filter((i) => i.id !== service.id));
    openResponseDialog({
      autoClose: true,
      content: `Service successfuly deleted.`,
      type: "SUCCESS",
    });
  };

  const handleServiceModalOpen = () => {
    setServiceModal({
      open: true,
      data: null,
    });
  };

  const handleServiceModalClose = () => {
    setServiceModal(defaultModal);
  };

  const handleEditServiceModalOpen = (service) => {
    setServiceModal({
      open: true,
      data: service,
    });
  };

  const handleRestoreRedirect = () => {
    router.push(PATHS.DOCTOR.SERVICES_RESTORE);
  };

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push(PATHS.DOCTOR.DASHBOARD),
        paths: [{ text: "Services" }],
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
            onClick={handleServiceModalOpen}
            startIcon={<AddCircleIcon />}
          >
            add service
          </Button>
        </>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { text: "Service", sx: { width: 200 } },
                { text: "Description" },
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
            {services.map((i) => {
              return (
                <TableRow key={i.id}>
                  <TableCells data={i} />
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditServiceModalOpen(i)}
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

      {serviceModal.open && (
        <ManageServiceModal
          open={serviceModal.open}
          data={serviceModal.data}
          onClose={handleServiceModalClose}
          onSave={!serviceModal.data ? handleAddService : handleEditService}
        />
      )}
    </AdminMainContainer>
  );
};

export default ServicesManagementPage;
