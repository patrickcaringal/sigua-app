import React from "react";

import { Box, Typography } from "@mui/material";

import { arrayStringify, formatTimeStamp } from "../../../../../modules/helper";
import { Datalist } from "../../../../common";

const Header = ({
  branch,
  date,
  doctors,
  capacity,
  registered,
  served,
  skipped,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 6,
      }}
    >
      <Datalist
        data={[
          {
            label: "Date",
            value: formatTimeStamp(date, "MMM-dd-yyyy eeee"),
          },
          {
            label: "Branch",
            value: branch,
          },
          {
            label: "Patients",
            value: `${registered} / ${capacity}`,
          },
        ]}
      />
      <Datalist
        data={[
          {
            label: "Doctor",
            value: (
              <>
                {doctors.map((i) => (
                  <Typography key={i} variant="body2">
                    {i}
                  </Typography>
                ))}
              </>
            ),
          },
          // {
          //   label: "Served Patients",
          //   value: served,
          // },
          // {
          //   label: "No Show Patients",
          //   value: skipped,
          // },
        ]}
        // labelWidth={200}
      />
    </Box>
  );
};

export default Header;
