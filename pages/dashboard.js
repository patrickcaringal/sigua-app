import React, { useState } from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Typography,
} from "@mui/material";
import lodash from "lodash";
import { useRouter } from "next/router";

import { PATHS } from "../components/common";
import { BranchesDialog } from "../components/shared";
import { useBackdropLoader } from "../contexts/BackdropLoaderContext";
import useRequest from "../hooks/useRequest";
import { getBranchesReq } from "../modules/firebase";

const defaultModal = {
  open: false,
  data: {},
  isSat: false,
};

const DashboardPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [branchesModal, setBranchesModal] = useState(defaultModal);

  const handleBranchModalOpen = async ({ isSat = false }) => {
    // Get Branches
    const { data: branchList, error: getBranchError } = await getBranches({
      mapService: false,
    });
    if (getBranchError) return openErrorDialog(getBranchError);

    const data = branchList.map((i) => ({
      ...lodash.pick(i, ["name", "id"]),
    }));

    setBranchesModal({
      open: true,
      data,
      isSat,
    });
  };

  const handleBranchModalClose = () => {
    setBranchesModal(defaultModal);
  };

  const handleBranchQueue = (branchId) => {
    router.push({
      pathname: PATHS.PATIENT.QUEUE_TODAY,
      query: { id: branchId },
    });
  };

  const handleBranchQueueSat = (branchId) => {
    router.push({
      pathname: PATHS.PATIENT.QUEUE_SUNDAY,
      query: { id: branchId },
    });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          height: { xs: "auto", md: "calc(100vh - 64px)" },
          display: "grid",
          gridTemplateColumns: { xs: "auto", md: "auto auto" },
          // flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "center",
          // border: "1px solid red",
          rowGap: { xs: 3, md: 0 },
          columnGap: 3,
          pt: { xs: 4, md: 0 },
          pb: { xs: 6, md: 0 },
        }}
      >
        <Card sx={{ width: 296, height: 208 }}>
          <CardActionArea
            sx={{ width: "inherit", height: "inherit" }}
            onClick={() => {
              router.push(PATHS.PATIENT.FAMILY);
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ textAlign: "center" }}
              >
                Manage Family
                <br />
                Members
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ width: 296, height: 208 }}>
          <CardActionArea sx={{ width: "inherit", height: "inherit" }}>
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={() => {
                router.push(PATHS.PATIENT.MEDICAL_RECORD);
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ textAlign: "center" }}
              >
                View Family
                <br />
                Records
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ width: 296, height: 208 }}>
          <CardActionArea
            sx={{ width: "inherit", height: "inherit" }}
            onClick={handleBranchModalOpen}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ textAlign: "center" }}
              >
                Queue
                <br />
                Today
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card sx={{ width: 296, height: 208 }}>
          <CardActionArea
            sx={{ width: "inherit", height: "inherit" }}
            onClick={() => handleBranchModalOpen({ isSat: true })}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                gutterBottom
                variant="h6"
                component="div"
                sx={{ textAlign: "center" }}
              >
                Sunday
                <br />
                Queue
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        {branchesModal.open && (
          <BranchesDialog
            open={branchesModal.open}
            data={branchesModal.data}
            onBranchClick={
              branchesModal.isSat ? handleBranchQueueSat : handleBranchQueue
            }
            onClose={handleBranchModalClose}
          />
        )}
      </Box>
    </Container>
  );
};

export default DashboardPage;
