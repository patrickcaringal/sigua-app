import React from "react";

import { Box, Typography } from "@mui/material";

const Patients = ({ served = [], noShow = [] }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", mt: 2, gap: 8 }}>
      <Box>
        <Typography variant="body1">
          Served Patients ({served.length})
        </Typography>
        <ol>
          {served.map((i) => (
            <li key={i.id}>
              <Typography variant="body2">
                {i.patientName} - {i.serviceName}
              </Typography>
            </li>
          ))}
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
