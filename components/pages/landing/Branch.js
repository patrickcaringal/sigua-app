import React from "react";

import { Box, Chip, Container, Typography } from "@mui/material";

const BranchSection = ({ branches, servicesMap }) => {
  return (
    <Box sx={{ backgroundColor: "#83C4FF" }}>
      <Container
        maxWidth="lg"
        sx={{
          // display: "flex",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
        }}
      >
        {branches.map((i, idx) => {
          const isEven = (idx + 1) % 2 == 0;
          const bg = isEven ? "#5DB2FF" : "transparent";
          return (
            <Box
              key={i.id}
              sx={{
                flex: 1,
                //   height: 320,
                backgroundColor: bg,
                display: "flex",
                flexDirection: "column",
                //   justifyContent: "center",
                alignItems: "center",
                py: 6,
                px: 4,
              }}
            >
              <Typography
                variant="h5"
                color="common.white"
                sx={{ letterSpacing: 2 }}
                fontWeight={600}
                gutterBottom
              >
                {i.name} BRANCH
              </Typography>
              <Typography variant="caption" color="common.white" sx={{ mb: 3 }}>
                {i.address}
              </Typography>

              <Typography
                variant="body1"
                fontWeight={500}
                color="common.white"
                sx={{ mb: 2 }}
              >
                Services
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                {i.servicesId.map((i, idx) => (
                  <Chip
                    key={idx}
                    label={servicesMap[i]}
                    color="primary"
                    // variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          );
        })}
      </Container>
    </Box>
  );
};

export default BranchSection;
