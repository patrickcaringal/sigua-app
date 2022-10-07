import React, { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../hooks";
import { getBaseApi } from "../../../../modules/env";
import { getFamilyMembersReq } from "../../../../modules/firebase";
import { calculateAge, formatTimeStamp } from "../../../../modules/helper";
import {
  ACTION_BUTTONS,
  Modal,
  TableContainer,
  getActionButtons,
} from "../../../common";
import { icons } from "../../patient/FamilyMembers/utils";
import PrintIdModal from "./PrintIdModal";

const defaultModal = {
  open: false,
  data: {},
};

const FamilyModal = ({ open = false, data: patientId, onClose }) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openErrorDialog } = useResponseDialog();

  // Requests
  const [getFamilyMembers] = useRequest(getFamilyMembersReq, setBackdropLoader);
  const [generateQRId] = useRequest(axios.post, setBackdropLoader);

  // Local States
  const [members, setMembers] = useState([]);
  const [printIdModal, setPrintIdModal] = useState(defaultModal); // Phone Verification Modal

  useEffect(() => {
    const fetch = async () => {
      const { data, error: getError } = await getFamilyMembers(patientId);
      if (getError) return openErrorDialog(getError);

      setMembers(data);
    };

    // if (data) fetch();
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleClose = () => {
    onClose();
  };

  const handlePrintIdModalOpen = async (data) => {
    try {
      const payload = {
        id: data.id,
        name: data.name,
      };
      // payload
      const res = await generateQRId(getBaseApi("/pdf"), payload);
      setPrintIdModal({
        open: true,
        data: res?.data,
      });
    } catch (error) {
      setBackdropLoader(false);
      openErrorDialog(error?.message);
    }
  };

  const handlePrintIdModalClose = () => {
    setPrintIdModal(defaultModal);
  };

  return (
    <>
      <Modal width="lg" open={open && !printIdModal.open} onClose={handleClose}>
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
                  View Family Members
                </Typography>

                <Button color="inherit" onClick={handleClose}>
                  Close
                </Button>
              </Toolbar>
            </Container>
          </AppBar>

          <Box sx={{ py: 2, px: 4 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {[
                      { text: "Name" },
                      { text: "Birthdate", sx: { width: 140 } },
                      { text: "Age", sx: { width: 40 }, align: "center" },
                      { text: "Gender", sx: { width: 100 } },
                      { text: "Contact No.", sx: { width: 140 } },
                      { text: "Status", sx: { width: 200 } },
                      // { text: "Address", sx: { width: 360 } },
                      { text: "Actions", sx: { width: 82 } },
                    ].map(({ text, align, sx }) => (
                      <TableCell
                        key={text}
                        {...(align && { align })}
                        sx={{ ...sx, fontWeight: "bold", p: 2 }}
                      >
                        {text}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {members.map((m, index) => {
                    const { id, name, gender, birthdate, contactNo, status } =
                      m;

                    return (
                      <TableRow key={id}>
                        <TableCell>{name}</TableCell>
                        <TableCell>
                          {formatTimeStamp(birthdate, "MMM-dd-yyyy")}
                        </TableCell>
                        <TableCell align="center">
                          {calculateAge(formatTimeStamp(birthdate))}
                        </TableCell>
                        <TableCell sx={{ textTransform: "capitalize" }}>
                          {gender}
                        </TableCell>
                        <TableCell>{contactNo}</TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {icons[status]}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {getActionButtons([
                            {
                              action: ACTION_BUTTONS.GENERATE_QR_CODE,
                              tooltipText: "Print ID",
                              onClick: () => handlePrintIdModalOpen(m),
                            },
                          ])}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>

      {printIdModal.open && (
        <PrintIdModal
          open={printIdModal.open}
          data={printIdModal.data}
          onClose={handlePrintIdModalClose}
        />
      )}
    </>
  );
};

export default FamilyModal;
