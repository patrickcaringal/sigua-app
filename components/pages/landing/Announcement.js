import React, { useEffect, useState } from "react";

import CampaignIcon from "@mui/icons-material/Campaign";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { Badge, Box, Chip, Container, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";

const AnnouncementSection = ({ announcements = [] }) => {
  if (announcements.length === 0) return null;

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
        }}
      >
        Announcements
      </Typography>

      <Container
        maxWidth="lg"
        sx={{
          // display: "flex",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 5,
        }}
      >
        {announcements.map((i, idx) => {
          const isEven = (idx + 1) % 2 == 0;
          const fd = isEven ? "row-reverse" : "row";
          return (
            <Badge
              key={idx}
              badgeContent={
                <Box
                  sx={{
                    bgcolor: "primary.dark",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 50,
                    width: 60,
                    height: 60,
                  }}
                >
                  <CampaignIcon
                    sx={{
                      fontSize: 40,
                      color: "primary.light",
                      alignSelf: "center",
                    }}
                  />
                </Box>
              }
              // color="primary"
              // overlap="circular"
            >
              <Card
                sx={{
                  flex: 1,
                  display: "flex",
                  minHeight: 200,
                  // flexDirection: fd,
                }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <CardContent>
                    <Typography variant="h5" fontWeight={500} gutterBottom>
                      {i.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      color="text.secondary"
                      sx={{ whiteSpace: "pre-line" }}
                    >
                      {i.content}
                    </Typography>
                  </CardContent>
                </Box>
                {/* <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 200,
                  backgroundColor: "primary.light",
                  // border: "1px solid red",
                }}
              >
                <CampaignIcon sx={{ fontSize: 140, color: "primary.dark" }} />
              </Box> */}
              </Card>
            </Badge>
          );
        })}
      </Container>
    </Box>
  );
};

export default AnnouncementSection;
