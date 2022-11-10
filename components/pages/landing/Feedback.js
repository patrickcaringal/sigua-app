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

var items = [
  {
    name: "Random Name #1",
    description: "Probably the most random thing you have ever seen!",
  },
  {
    name: "Random Name #2",
    description: "Hello World!",
  },
];

const FeedbackSection = ({ feedbacks = [] }) => {
  if (feedbacks.length === 0) return null;

  return (
    <Box sx={{ py: 10, minHeight: 500 }}>
      <Typography
        variant="h3"
        fontWeight={600}
        color="primary.dark"
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
        sx={
          {
            // display: "grid",
            // gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            // px: { xs: 5, md: 0 },
            // gap: 5,
          }
        }
      >
        {/* {feedbacks.map((i, idx) => {
          const isEven = (idx + 1) % 2 == 0;
          const fd = isEven ? "row-reverse" : "row";
          const { feedback } = i;
          return <>{feedback}</>;
        })} */}
        <Carousel>
          {feedbacks.map((item, i) => (
            <Paper key={i}>
              <Typography>{item.feedback}</Typography>
              <Typography>{item.accountName}</Typography>
              <Typography>
                {formatTimeStamp(item.dateCreated, "MMM yyyy")}
              </Typography>
              {/* <p>{item.description}</p> */}

              <Button className="CheckButton">Check it out!</Button>
            </Paper>
          ))}
        </Carousel>
      </Container>
    </Box>
  );
};

export default FeedbackSection;
