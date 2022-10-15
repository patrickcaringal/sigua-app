import React from "react";

import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { LongTypography, TableContainer } from "../../../../components/common";
import { formatTimeStamp } from "../../../../modules/helper";

const MedicalHistory = ({ data = [], onRecordClick }) => {
  return (
    <TableContainer maxHeight="calc(100vh - 64px - 64px - 210px)">
      <Table size="small">
        <TableHead>
          <TableRow>
            {[
              { text: "Date of Visit", sx: { width: 140 } },
              { text: "Branch", sx: { width: 140 } },
              { text: "Service" },
              { text: "Doctor", sx: { width: 160 } },
              // { text: "Diagnosis" },
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
          {data.map((i, index) => {
            const {
              dateCreated,
              serviceName,
              branchName,
              doctorName,
              diagnosis,
            } = i;
            return (
              <TableRow key={index}>
                <TableCell>
                  {formatTimeStamp(dateCreated, "MMM-dd-yyyy")}
                </TableCell>
                <TableCell>{branchName}</TableCell>
                <TableCell>
                  <LongTypography text={serviceName} displayedLines={1} />
                </TableCell>
                <TableCell>
                  <LongTypography text={doctorName} displayedLines={1} />
                </TableCell>
                {/* <TableCell>
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
                  {diagnosis}
                </Typography>
              </TableCell> */}
                <TableCell align="center">
                  <IconButton size="small" onClick={() => onRecordClick(i)}>
                    <AssignmentIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MedicalHistory;
