import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { useRouter } from "next/router";

import { ManageServiceModal } from "../../components/pages/doctor/ServiceManagement";
import { AdminMainContainer } from "../../components/shared";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import {
  addServiceReq,
  deleteServiceReq,
  getServicesReq,
  updateServiceReq,
} from "../../modules/firebase";
import { pluralize } from "../../modules/helper";

const defaultModal = {
  open: false,
  data: {},
};

const ServicesManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();
  const confirmDialog = useResponseDialog();

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

  const handleAddService = async (newService) => {
    // Add Services
    const { data: addedService, error: addServicesError } = await addService({
      docs: newService,
    });
    if (addServicesError) return openErrorDialog(addServicesError);

    // Successful
    setServices((prev) => [...prev, ...addedService]);
    openResponseDialog({
      autoClose: true,
      content: `${pluralize(
        "Service",
        addedService.length
      )} successfuly added.`,
      type: "SUCCESS",
      closeCb() {
        setServiceModal(defaultModal);
      },
    });
  };

  const handleEditService = async (updatedDocs) => {
    const updatedService = updatedDocs[0];
    const serviceCopy = [...services];
    const index = serviceCopy.findIndex((i) => i.id === updatedService.id);

    serviceCopy[index] = {
      ...serviceCopy[index],
      ...updatedService,
    };

    // Update
    const { error: updateError } = await updateService({
      service: updatedService,
    });
    if (updateError) return openErrorDialog(updateError);

    // Success
    setServices(serviceCopy);
    openResponseDialog({
      autoClose: true,
      content: "Service successfuly updated.",
      type: "SUCCESS",
      closeCb() {
        setServiceModal(defaultModal);
      },
    });
  };

  const handleDeleteConfirm = (service) => {
    openResponseDialog({
      content: `Are you sure you want to delete Service(${service.name})`,
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
      content: `Service(${service.name}) successfuly deleted.`,
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

  return (
    <AdminMainContainer
      toolbarProps={{
        onRootClick: () => router.push("/doctor/dashboard"),
        paths: [{ text: "Services" }],
      }}
      toolbarContent={
        <Button
          variant="contained"
          size="small"
          onClick={handleServiceModalOpen}
          startIcon={<AddCircleIcon />}
        >
          add service
        </Button>
      }
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Service", "Description", "Actions"].map((i) => (
                <TableCell key={i} sx={{ fontWeight: "bold" }}>
                  {i}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {services.map((i) => {
              const { id, name, description } = i;

              return (
                <TableRow key={id}>
                  <TableCell sx={{ width: 250 }}>{name}</TableCell>
                  <TableCell>
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
                      {description}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ width: 150 }}>
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
