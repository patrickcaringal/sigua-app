import React, { useEffect, useState } from "react";

import CampaignIcon from "@mui/icons-material/Campaign";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import {
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Typography,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import Carousel from "react-material-ui-carousel";

import {
  calculateAge,
  formatTimeStamp,
  localUpdateDocs,
} from "../,,/../../../modules/helper";

const FeedbackSection = ({ feedbacks = [] }) => {
  if (feedbacks.length === 0) return null;

  return (
    <Box sx={{ py: 10, minHeight: 580, bgcolor: "#5DB2FF" }}>
      <Typography
        variant="h3"
        fontWeight={600}
        color="common.white"
        sx={{
          textAlign: "center",
          mb: 8,
          letterSpacing: 5,
          textTransform: "uppercase",
          fontSize: { xs: "2rem", md: "3rem" },
        }}
      >
        Feedbacks
      </Typography>

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Carousel sx={{ width: { xs: "100%", md: 700 } }}>
          {feedbacks.map((item, i) => (
            <Paper
              key={i}
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: "grey.200",
              }}
            >
              <Typography sx={{ mb: 3, textAlign: "center" }}>
                {item.feedback}
              </Typography>
              {/* <Typography sx={{ mb: 3, textAlign: "center" }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </Typography> */}
              <Typography variant="subtitle2">{item.accountName}</Typography>
              <Typography variant="caption">
                {formatTimeStamp(item.dateCreated, "MMM yyyy")}
              </Typography>
            </Paper>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
};

export default FeedbackSection;
