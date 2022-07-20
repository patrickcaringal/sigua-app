import React, { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { Toolbar } from "../../components/common";
import { ManageServiceModal } from "../../components/pages/doctor/ServiceManagement";
import { useBackdropLoader } from "../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../contexts/ResponseDialogContext";
import useRequest from "../../hooks/useRequest";
import { addServiceReq, getServicesReq } from "../../modules/firebase";
import { getFullName, getUniquePersonId } from "../../modules/helper";
const ServicesManagementPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getServices] = useRequest(getServicesReq, setBackdropLoader);
  const [addService] = useRequest(addServiceReq, setBackdropLoader);

  // Local States
  const [services, setServices] = useState([]);
  const [servicehModalOpen, setServiceModalOpen] = useState(false);

  // const staffsUniqueId = services.map((i) => {
  //   const { firstName, middleName, lastName, birthdate } = i;
  //   const m = getUniquePersonId({ firstName, middleName, lastName, birthdate });
  //   return m;
  // });

  useEffect(() => {
    const fetch = async () => {
      // Get Services
      const { data: serviceList, error: getServicesError } =
        await getServices();
      if (getServicesError) return openErrorDialog(getServicesError);

      console.log(serviceList);
      setServices(serviceList);
    };
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleServiceModalOpen = () => {
    setServiceModalOpen(true);
  };

  // const handleCheckDuplicate = (newStaff) => staffsUniqueId.includes(newStaff);

  const handleAddService = async (newService) => {
    // Add Services
    const { error: addServicesError } = await addService({
      services: newService,
    });
    if (addServicesError) return openErrorDialog(addServicesError);

    // Successful
    const allServices = [...services, ...newService];
    setServices(allServices);

    openResponseDialog({
      autoClose: true,
      content: "Services successfuly added.",
      type: "SUCCESS",
      closeCb() {
        setServiceModalOpen(false);
      },
    });
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        mx: 4,
      }}
    >
      <Toolbar
        onRootClick={() => router.push("/doctor/dashboard")}
        paths={[{ text: "Services" }]}
      >
        <Button
          variant="contained"
          size="small"
          onClick={handleServiceModalOpen}
          startIcon={<AddCircleIcon />}
        >
          add service
        </Button>
      </Toolbar>
      <Box>
        <Paper
          elevation={2}
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Service</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {services.map((i) => {
                  const { id, name, description } = i;

                  return (
                    <TableRow key={id}>
                      <TableCell>{name}</TableCell>
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
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <ManageServiceModal
        open={servicehModalOpen}
        setOpen={setServiceModalOpen}
        // onCheckDuplicate={handleCheckDuplicate}
        onAddService={handleAddService}
      />
    </Box>
  );
};

export default ServicesManagementPage;
