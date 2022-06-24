import React from "react";

import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";

const DashboardPage = () => {
  const router = useRouter();

  // 296 * 208
  // Manage family members
  // View family records
  //

  // sx={{ mt: 300 }}
  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid gray",
        py: 4,
        px: 2,
      }}
    >
      <Card sx={{ width: 296, height: 208 }}>
        <CardActionArea sx={{ width: "inherit", height: "inherit" }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Manage Family
              <br />
              Members
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card sx={{ width: 296, height: 208, mx: 4 }}>
        <CardActionArea sx={{ width: "inherit", height: "inherit" }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              View Family
              <br />
              Records
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>

      <Card sx={{ width: 296, height: 208 }}>
        <CardActionArea sx={{ width: "inherit", height: "inherit" }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              sx={{ textAlign: "center" }}
            >
              Get Queue
              <br />
              Number
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default DashboardPage;
