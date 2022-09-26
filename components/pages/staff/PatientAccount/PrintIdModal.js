import React, { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getFamilyMembersReq } from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import { ACTION_BUTTONS, Modal, PdfFrame } from "../../../common";
import { icons } from "../../patient/FamilyMembers/utils";

const PrintIdModal = ({ open = false, data, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            // alignItems: "center",
          }}
        >
          <AppBar sx={{ position: "sticky" }}>
            <Container maxWidth="lg">
              <Toolbar disableGutters>
                <Typography
                  sx={{ ml: 2, flex: 1 }}
                  variant="h6"
                  component="div"
                >
                  Print ID
                </Typography>

                <Button color="inherit" onClick={handleClose}>
                  Close
                </Button>
              </Toolbar>
            </Container>
          </AppBar>

          <Box sx={{ py: 2, px: 4 }}>
            <PdfFrame src={`${data}`} width="100%" height="600" />
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PrintIdModal;
