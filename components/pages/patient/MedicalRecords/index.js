import React, { useEffect, useLayoutEffect, useState } from "react";

import { Box, Container, MenuItem, Typography } from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { usePagination, useRequest } from "../../../../hooks";
import {
  getPatientRecordReq,
  getVerifiedFamilyMembersReq,
} from "../../../../modules/firebase";
import { Pagination, Placeholder, Select, Toolbar } from "../../../common";
import Card from "./Card";

const MedicalRecordPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients, patientLoading] = useRequest(
    getVerifiedFamilyMembersReq,
    setBackdropLoader
  );
  const [getPatientRecord, patientRecordLoading] = useRequest(
    getPatientRecordReq,
    setBackdropLoader
  );

  // Local States
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const pagination = usePagination(medicalRecords, 2);
  const tableData = medicalRecords.slice(
    pagination.info.start,
    pagination.info.end
  );
  const isLoading = patientLoading || patientRecordLoading;
  const showConent = !isLoading && selectedPatient && tableData.length !== 0;

  useLayoutEffect(() => {
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
        pagination.setTotalItems(data.length);
        pagination.goToPage(0);
      };

      fetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  const handlePageChange = (event, value) => {
    pagination.goToPage(value - 1);
  };

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

        {showConent ? (
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
            {tableData.map((i) => (
              <Card key={i.id} data={i} />
            ))}
          </Box>
        ) : (
          // "Select a family member"
          <Placeholder
            display={!isLoading}
            text={
              !selectedPatient
                ? "Select a family member"
                : tableData.length === 0
                ? "No medical record"
                : ""
            }
          />
        )}
        <Pagination
          display={!isLoading}
          pagination={pagination}
          onChange={handlePageChange}
        />
      </Box>
    </Container>
  );
};

export default MedicalRecordPage;
