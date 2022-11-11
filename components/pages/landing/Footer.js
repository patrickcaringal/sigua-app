import React from "react";

import { Box, Container, Paper, Typography } from "@mui/material";
import Image from "next/image";

import { Logo } from "../../../components";

const FooterSection = () => {
  return (
    <Box
      sx={{
        // border: "1px solid red",
        py: 2,
        bgcolor: "primary.dark",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <Image src="/sigua-website-qr.png" alt="" width="60px" height="60px" />
        <Typography sx={{ ml: 3, color: "common.white", flexGrow: 1 }}>
          Copyright &copy; 2022 Sigua Medical Clinic
        </Typography>
        {/* <Paper sx={{}}>
          <Logo width="160" height="56" />
        </Paper> */}
      </Container>
    </Box>
  );
};

export default FooterSection;
