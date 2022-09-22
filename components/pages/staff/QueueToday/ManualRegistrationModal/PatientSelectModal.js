import React, { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";

import { useBackdropLoader } from "../../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../../contexts/ResponseDialogContext";
import { useRequest } from "../../../../../hooks/";
import { getPatientReq } from "../../../../../modules/firebase";
import { Modal } from "../../../../common";
import PatientDetails from "./PatientDetails";
import PatientScan from "./PatientScan";
import PatientsSearch from "./PatientsSearch";

const MODE = {
  SCAN: "SCAN",
  SEARCH: "SEARCH",
};

const PatientSelectModal = ({ open = false, onSelect, onClose }) => {
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatient] = useRequest(getPatientReq, setBackdropLoader);

  // Local States
  const [patientId, setPatientId] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [mode, setMode] = useState(MODE.SCAN);

  const displaySearch = mode === MODE.SEARCH && !patientId;
  const displayScan = mode === MODE.SCAN && !patientId;
  const hasSelected = !!patientId;

  useEffect(() => {
    if (patientId) {
      const fetch = async () => {
        // Get Patient
        const { data, error: getError } = await getPatient({ id: patientId });
        if (getError) return openErrorDialog(getError);
        setPatientData(data);
      };

      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const handleConfirm = () => {
    onSelect(patientData);
    onClose();
  };

  const handlePatientSelect = (id) => {
    setPatientId(id);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ overflow: "overlay" }}>
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Choose Patient
              </Typography>

              {!!patientId && (
                <Button
                  color="inherit"
                  sx={{ mr: 2 }}
                  onClick={() => {
                    setPatientId(null);
                    setPatientData(null);
                  }}
                >
                  reselect patient
                </Button>
              )}
              {!hasSelected && mode === MODE.SEARCH && (
                <Button
                  color="inherit"
                  sx={{ mr: 2 }}
                  onClick={() => setMode(MODE.SCAN)}
                >
                  scan
                </Button>
              )}
              {!hasSelected && mode === MODE.SCAN && (
                <Button
                  color="inherit"
                  sx={{ mr: 2 }}
                  onClick={() => setMode(MODE.SEARCH)}
                >
                  search
                </Button>
              )}

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={!hasSelected && !patientData}
                onClick={handleConfirm}
              >
                confirm
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2, minHeight: 200 }}>
          <Container maxWidth="lg" sx={{ pt: 0 }}>
            {displayScan && (
              <PatientScan onPatientSelect={handlePatientSelect} />
            )}
            {displaySearch && (
              <PatientsSearch onPatientSelect={handlePatientSelect} />
            )}

            {patientData && <PatientDetails patient={patientData} />}
          </Container>
        </Box>
      </Box>
    </Modal>
  );
};

export default PatientSelectModal;
