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

const QueueList = ({
  title,
  queueKey,
  queue = [],
  onTransferClick,
  enableFirstItemOnly = false,
  placeholderText = "None",
}) => {
  return (
    <Box
      sx={{
        // height: "calc((100vh - 270px ) / 2)",
        flex: 1,
        // border: "1px solid blue",
        boxShadow: 2,
        borderRadius: 1,
      }}
    >
      <List dense disablePadding>
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
                {title}
              </Typography>
            }
          />
        </ListItem>
        {queue.length === 0 && (
          <ListItem alignItems="flex-start">
            <ListItemText
              primary={
                <Typography
                  display="block"
                  variant="caption"
                  fontWeight="medium"
                >
                  {placeholderText}
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>

      <List
        sx={{
          overflow: "overlay",
          maxHeight: "calc((100vh - 348px) / 2)",
        }}
        dense
        disablePadding
      >
        {queue.map((i, index) => {
          const { queueNo, patientName, serviceName } = i;
          const moveDisabled = enableFirstItemOnly && index !== 0;

          return (
            <>
              <ListItem
                key={queueNo}
                alignItems="flex-start"
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() =>
                      onTransferClick({ patient: i, from: queueKey })
                    }
                    disabled={moveDisabled}
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
              <Divider component="li" />
              {/* {index + 1 !== queue.length && <Divider component="li" />} */}
            </>
          );
        })}
      </List>
    </Box>
  );
};

export default QueueList;
