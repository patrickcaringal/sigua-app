import React, { Fragment } from "react";

import { Box, Chip } from "@mui/material";

import { formatTimeStamp } from "../../../../modules/helper";

const Header = ({
  branch,
  date,
  capacity,
  registered,
  isQueueFull,
  isRegOpen,
  isQueueOpen,
}) => {
  return (
    <Box sx={{ mx: 2, pt: 2, display: "flex", flexDirection: "row", gap: 6 }}>
      <Box
        sx={{
          display: "grid",
          grid: "auto-flow / 0fr 1fr",
          alignItems: "center",
          rowGap: 1,
        }}
      >
        {[
          {
            label: "Branch",
            value: branch,
          },
          {
            label: "Date",
            value: formatTimeStamp(date, "MMM-dd-yyyy (eee)"),
          },
        ].map(({ label, value }, index) => (
          <Fragment key={index}>
            <Box sx={{ minWidth: 100 }}>{label}</Box>
            <Box sx={{ fontWeight: "500" }}>{value}</Box>
          </Fragment>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          grid: "auto-flow / 0fr 1fr",
          alignItems: "center",
          rowGap: 1,
        }}
      >
        {[
          {
            label: "Status",
            value: (
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                {isQueueFull ? (
                  <Chip label="Queue Full" color="error" size="small" />
                ) : isRegOpen ? (
                  <Chip
                    label="Registration Open"
                    color="primary"
                    size="small"
                  />
                ) : (
                  <Chip label="Registration Close" color="error" size="small" />
                )}
                {isQueueOpen ? (
                  <Chip label="Queue Ongoing" color="primary" size="small" />
                ) : (
                  <Chip label="Queue Close" color="error" size="small" />
                )}
              </Box>
            ),
          },
          {
            label: "Capacity",
            value: `${registered} / ${capacity}`,
          },
        ].map(({ label, value }, index) => (
          <Fragment key={index}>
            <Box sx={{ minWidth: 100 }}>{label}</Box>
            <Box sx={{ fontWeight: "500" }}>{value}</Box>
          </Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default Header;
