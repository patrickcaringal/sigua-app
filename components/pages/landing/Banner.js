import React from "react";

import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";

const Banner = () => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: "flex",
        flexDirection: "row",
        py: 4,
        mb: 5,
        //   border: "1px solid blue",
      }}
    >
      <Box sx={{ width: 500 }}>
        <Image
          src="/banner.png"
          alt=""
          width="100%"
          height="100%"
          layout="responsive"
          objectFit="contain"
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          justifyContent: "center",
          flex: 1,
          ml: 8,
          // my: 3,
          // mb: 10,
          // border: "1px solid blue",
        }}
      >
        <Typography variant="h3" fontWeight={600} color="primary.dark">
          We Care
        </Typography>
        <Typography
          variant="h3"
          fontWeight={600}
          color="primary.light"
          gutterBottom
        >
          About Your Health
        </Typography>
        <Typography
          variant="h6"
          fontWeight={400}
          fontStyle="italic"
          color="primary.dark"
        >
          Not just better healthcare, but a better healthcare experience.
        </Typography>
      </Box>
    </Container>
  );
};

export default Banner;
