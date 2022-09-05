import React, { useState } from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
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
};

const DashboardPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();

  // Requests
  const [getBranches] = useRequest(getBranchesReq, setBackdropLoader);

  // Local States
  const [branchesModal, setBranchesModal] = useState(defaultModal);

  const handleBranchModalOpen = async () => {
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
    });
  };

  const handleBranchModalClose = () => {
    setBranchesModal(defaultModal);
  };

  const handleBranchQueue = (branchId) => {
    router.push(`/queue/${branchId}`);
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center",
        rowGap: 3,
        columnGap: 3,
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

      {branchesModal.open && (
        <BranchesDialog
          open={branchesModal.open}
          data={branchesModal.data}
          onBranchClick={handleBranchQueue}
          onClose={handleBranchModalClose}
        />
      )}
    </Box>
  );
};

export default DashboardPage;
