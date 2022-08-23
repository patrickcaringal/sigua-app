import React, { useEffect, useState } from "react";

import FactCheckIcon from "@mui/icons-material/FactCheck";
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
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

import { useBackdropLoader } from "../../../../contexts/BackdropLoaderContext";
import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import useRequest from "../../../../hooks/useRequest";
import {
  MEMBER_STATUS,
  deleteImageReq,
  getPatientsReq,
  updatePatientReq,
} from "../../../../modules/firebase";
import {
  calculateAge,
  formatTimeStamp,
  getFullName,
  localUpdateDocs,
} from "../../../../modules/helper";
import { PATHS, Toolbar, successMessage } from "../../../common";
import MemberApprovalModal from "./MemberApprovalModal";

const PatientListPage = () => {
  const router = useRouter();
  const { setBackdropLoader } = useBackdropLoader();
  const { openResponseDialog, openErrorDialog } = useResponseDialog();

  // Requests
  const [getPatients] = useRequest(getPatientsReq, setBackdropLoader);
  const [updatePatient] = useRequest(updatePatientReq);
  const [deleteImage] = useRequest(deleteImageReq);

  // Local States
  const [patients, setPatients] = useState([]);
  const [memberApprovalModal, setMemberApprovalModal] = useState({
    open: false,
    data: null,
  });

  useEffect(() => {
    const fetch = async () => {
      // Get Patients
      const { data: patientList, error: getPatientsError } = await getPatients(
        {}
      );
      if (getPatientsError) return openErrorDialog(getPatientsError);

      setPatients(patientList);
    };

    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMemberModalOpen = (m) => {
    setMemberApprovalModal({
      open: true,
      data: m,
    });
  };

  const handleMemberModalClose = () => {
    setMemberApprovalModal({
      open: false,
      data: null,
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
        paths={[{ text: "Patients" }]}
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
                    { text: "Actions", align: "right" },
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
                  const { name, gender, birthdate, contactNo, address } = m;

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
                            WebkitLineClamp: "2",
                            overflow: "hidden",
                          }}
                          component="div"
                        >
                          {address}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        {/* <FactCheckIcon /> */}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {memberApprovalModal.open && (
        <MemberApprovalModal
          open={memberApprovalModal.open}
          data={memberApprovalModal.data}
          onClose={handleMemberModalClose}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </Box>
  );
};

export default PatientListPage;
