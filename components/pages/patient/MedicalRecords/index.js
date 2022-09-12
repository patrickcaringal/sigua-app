import React, { useEffect, useState } from "react";

import { Box, Button, Container, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  MEMBER_STATUS,
  getPatientRecordReq,
  getVerifiedFamilyMembersReq,
} from "../../../../modules/firebase";
import {
  formatTimeStamp,
  localUpdateDocs,
  personBuiltInFields,
  pluralize,
} from "../../../../modules/helper";
import { Select, Toolbar, successMessage } from "../../../common";
import Card from "./Card";

const defaultModal = {
  open: false,
  data: {},
};

const MedicalRecordPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients, patientsLoading] = useRequest(
    getVerifiedFamilyMembersReq,
    setBackdropLoader
  );
  const [getPatientRecord] = useRequest(getPatientRecordReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    if (user.id) {
      const fetch = async () => {
        // Get Family Members
        const payload = { id: user.id };
        const { data, error: getError } = await getPatients(payload);
        if (getError) return openErrorDialog(getError);

        setPatients(data);
      };

      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  useEffect(() => {
    if (selectedPatient) {
      const fetch = async () => {
        // Get Medical Record
        const payload = { id: selectedPatient };
        const { data, error: getError } = await getPatientRecord(payload);
        if (getError) return openErrorDialog(getError);

        setMedicalRecords(data);
      };

      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  return (
    <Container maxWidth="lg">
      <Toolbar
        onRootClick={() => router.push("/dashboard")}
        paths={[{ text: "Medical Records" }]}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          mt: 1,
          pb: 1,
        }}
      >
        <Select
          required
          value={selectedPatient}
          label="Family Member"
          onChange={(e) => {
            const val = e.target.value;
            setSelectedPatient(val);
          }}
        >
          {patients.map(({ id, name }) => (
            <MenuItem key={id} value={id} dense>
              {name}
            </MenuItem>
          ))}
        </Select>

        {selectedPatient ? (
          <Box
            sx={{
              flex: 1,
              // border: "1px solid red",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "wrap",
              gap: 2,
              mt: 3,
            }}
          >
            {medicalRecords.map((i) => {
              return <Card key={i.id} data={i} />;
            })}
          </Box>
        ) : (
          <Box
            sx={{
              // border: "1px solid blue",
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: "calc(100vh / 3)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{}}>
              <Typography variant="h6" color="text.secondary">
                Select a family member
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MedicalRecordPage;
