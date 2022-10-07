import React from "react";

import { Box } from "@mui/material";

import { arrayStringify, formatTimeStamp } from "../../../../modules/helper";
import { Datalist } from "../../../common";

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
    <Box sx={{ mx: 2, pt: 2, display: "flex", flexDirection: "row", gap: 6 }}>
      <Datalist
        data={[
          {
            label: "Branch",
            value: branch,
          },
          {
            label: "Date",
            value: formatTimeStamp(date, "MMM-dd-yyyy (eee)"),
          },
          {
            label: "Doctor",
            value: arrayStringify(doctors),
          },
        ]}
      />
      <Datalist
        data={[
          {
            label: "Capacity / Registered",
            value: `${registered} / ${capacity}`,
          },
          {
            label: "Served Patients",
            value: served,
          },
          {
            label: "No Show Patients",
            value: skipped,
          },
        ]}
        labelWidth={190}
      />
    </Box>
  );
};

export default Header;
