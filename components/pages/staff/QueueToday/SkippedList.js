import React from "react";

import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

const SkippedList = ({ queue, onTransferClick }) => {
  return (
    <Box
      sx={{
        flex: 1,
        height: "calc((100vh - 290px ) / 2)",
        // border: "1px solid red",
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          boxShadow: 2,
          borderRadius: 1,
        }}
        dense
        disablePadding
      >
        <ListItem
          sx={{
            bgcolor: "primary.light",
            borderTopLeftRadius: "4px !important",
            borderTopRightRadius: "4px !important",
            py: 1,
          }}
        >
          <ListItemText
            primary={
              <Typography
                display="block"
                variant="body2"
                fontWeight="medium"
                color="common.white"
              >
                SKIPPED
              </Typography>
            }
          />
        </ListItem>
        {queue.map((i, index) => {
          const { queueNo, patientName, serviceName } = i;

          return (
            <>
              <ListItem
                key={queueNo}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() =>
                      onTransferClick({ patient: i, from: "skipped" })
                    }
                  >
                    <ArrowRightIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.light",
                      width: 32,
                      height: 32,
                    }}
                  >
                    {queueNo}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      display="block"
                      variant="caption"
                      fontWeight="medium"
                    >
                      {patientName}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      display="block"
                      variant="caption"
                      color="text.secondary"
                    >
                      {serviceName}
                    </Typography>
                  }
                />
              </ListItem>
              {index + 1 !== queue.length && <Divider component="li" />}
            </>
          );
        })}

        {queue.length === 0 && (
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <Typography
                  display="block"
                  variant="caption"
                  fontWeight="medium"
                >
                  None
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default SkippedList;
