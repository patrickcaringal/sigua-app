import React from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";

const MedicalHistory = ({ data = [] }) => {
  return (
    <Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                { text: "Date of Visit", sx: { width: 140 } },
                { text: "Branch", sx: { width: 140 } },
                { text: "Service", sx: { width: 140 } },
                { text: "Doctor", sx: { width: 160 } },
                { text: "Diagnosis" },
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
            {data.map((i, index) => {
              const {
                dateCreated,
                serviceName,
                branchName,
                doctorName,
                diagnosis,
                patientNote,
              } = i;
              return (
                <TableRow key={index}>
                  <TableCell>
                    {formatTimeStamp(dateCreated, "MMM-dd-yyyy")}
                  </TableCell>
                  <TableCell>{branchName}</TableCell>
                  <TableCell>{serviceName}</TableCell>
                  <TableCell>{doctorName}</TableCell>
                  <TableCell>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: "2",
                        overflow: "hidden",
                        whiteSpace: "pre-line",
                      }}
                      component="div"
                    >
                      {diagnosis}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MedicalHistory;
