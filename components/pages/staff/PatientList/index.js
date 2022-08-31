import React, { useEffect, useState } from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useAuth } from "../../../../contexts/AuthContext";
import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  MEMBER_STATUS,
  deleteImageReq,
  getPatientsByBranchReq,
  updatePatientReq,
} from "../../../../modules/firebase";
import {
  calculateAge,
  formatTimeStamp,
  getFullName,
  localUpdateDocs,
} from "../../../../modules/helper";
import { PATHS, Toolbar, successMessage } from "../../../common";

const PatientListPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsByBranchReq, setBackdropLoader);

  // Local States
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const payload = { id: user.branch };
      const { data: patientList, error: getError } = await getPatients(payload);
      if (getError) return openErrorDialog(getError);

      setPatients(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleViewMedicalRecord = (id) => {
    router.push({
      pathname: `/staff/patients/[id]/medical-record`,
      query: { id },
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
        onRootClick={() => router.push(PATHS.STAFF.DASHBOARD)}
        paths={[{ text: "Patient Records" }]}
      />
      <Box>
        <Paper
          elevation={2}
          sx={{ height: "calc(100vh - 64px - 64px - 16px)" }}
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {[
                    { text: "Name" },
                    { text: "Birthdate", sx: { width: 140 } },
                    { text: "Age", sx: { width: 100 }, align: "center" },
                    { text: "Gender", sx: { width: 100 } },
                    { text: "Contact No.", sx: { width: 140 } },
                    { text: "Address" },
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
                {patients.map((m, index) => {
                  const { id, name, gender, birthdate, contactNo, address } = m;

                  return (
                    <TableRow key={index}>
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
                      <TableCell sx={{ maxWidth: 300, height: 53 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: "1",
                            overflow: "hidden",
                          }}
                          component="div"
                        >
                          {address}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Medical Records">
                          <IconButton
                            size="small"
                            onClick={() => handleViewMedicalRecord(id)}
                          >
                            <AssignmentIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Box>
  );
};

export default PatientListPage;
