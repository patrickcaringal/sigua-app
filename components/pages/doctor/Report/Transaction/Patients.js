import React from "react";

import { Box, Typography } from "@mui/material";

import { PATHS } from "../../../../common";

export const getQueryString = (reqQueries) => {
  return Object.entries(reqQueries)
    .map(([key, value]) => {
      if (!value || !value.length) return "";

      if (typeof value === "object" && Array.isArray(value)) {
        return `${key}=${`${value.join(",")}`.trim()}`;
      }

      return value && `${key}=${value.trim()}`;
    })
    .filter((i) => i)
    .join("&");
};

const Patients = ({ served = [], noShow = [], query }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", mt: 2, gap: 8 }}>
      <Box>
        <Typography variant="body1">
          Served Patients ({served.length})
        </Typography>
        <ol>
          {served.map((i) => {
            const url = PATHS.DOCTOR.PATIENTS_MEDICAL_RECORD.replace(
              "[id]",
              i.patientId
            );
            const qs = getQueryString({
              service: i.serviceId,
              ...query,
            });

            return (
              <li key={i.id}>
                {/* <Typography
                  variant="body2"
                  onClick={() => handlePatientClick(i)}
                  sx={{ cursor: "pointer" }}
                >
                  {i.patientName} - {i.serviceName}
                </Typography> */}
                <a target="_blank" href={`${url}?${qs}`} rel="noreferrer">
                  <Typography variant="body2" sx={{ cursor: "pointer" }}>
                    {i.patientName} - {i.serviceName}
                  </Typography>
                </a>
              </li>
            );
          })}
        </ol>
      </Box>

      <Box>
        <Typography variant="body1">
          No Show Patients ({noShow.length})
        </Typography>
        <ol>
          {noShow.map((i) => (
            <li key={i.id}>
              <Typography variant="body2">
                {i.patientName} - {i.serviceName}
              </Typography>
            </li>
          ))}
        </ol>
      </Box>
    </Box>
  );
};

export default Patients;
