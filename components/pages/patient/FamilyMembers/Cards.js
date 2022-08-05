import React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  formatDate,
  formatTimeStamp,
  getFullName,
  getInitials,
} from "../../../../modules/helper";
import { MEMBER_STATUS, icons, statusUploadAllowed } from "./utils";

const Cards = ({ data, onEditModal, onVerificationModal, onPhoneModal }) => {
  return (
    <>
      {data.map((i, index) => {
        const {
          firstName,
          contactNo,
          birthdate,
          address,
          gender,
          verified,
          verifiedContactNo,
          verificationAttachment,
          verificationRejectReason,
        } = i;

        const status = verified
          ? MEMBER_STATUS.VERFIED // by staff approval
          : !verificationAttachment
          ? MEMBER_STATUS.FOR_VERIFICATION // no attachment
          : verificationAttachment && verificationRejectReason
          ? MEMBER_STATUS.REJECTED // has attachment and has reject
          : MEMBER_STATUS.FOR_APPROVAL; //
        return (
          <Card
            key={index}
            sx={{
              width: { xs: "100%", md: 370 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }} aria-label="recipe">
                  {getInitials(firstName)}
                </Avatar>
              }
              title={getFullName(i)}
              subheader={
                status === MEMBER_STATUS.REJECTED ? (
                  <Tooltip
                    title={`Rejection reason: ${verificationRejectReason}`}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {icons[status]}
                    </Typography>
                  </Tooltip>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {icons[status]}
                  </Typography>
                )
              }
            />
            <CardContent sx={{ pt: 0, pb: 1, flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  color={
                    !!verifiedContactNo ? "text.secondary" : "text.disabled"
                  }
                >
                  {contactNo}
                </Typography>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {formatTimeStamp(birthdate, "MMMM dd, yyyy")}
                </Typography>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  sx={{ mx: 1, my: 0, borderColor: "grey.A400" }}
                />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {gender}
                </Typography>
              </Box>

              <Typography
                variant="caption"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: "2",
                  overflow: "hidden",
                }}
                component="div"
                color="text.secondary"
              >
                {address}
              </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex" }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEditModal(i)}
              >
                Edit
              </Button>
              {statusUploadAllowed.includes(status) && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<UploadFileIcon />}
                  onClick={() => onVerificationModal(i)}
                >
                  Upload
                </Button>
              )}
              {status === MEMBER_STATUS.VERFIED && !verifiedContactNo && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PhoneIphoneIcon />}
                  onClick={() => onPhoneModal(i)}
                >
                  Verify
                </Button>
              )}
              {/* <Button
                variant="outlined"
                size="small"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => onEditModal(i)}
                sx={{ marginLeft: "auto !important" }}
              >
                Delete
              </Button> */}
              {/* <IconButton
                size="small"
                color="error"
                onClick={() => {}}
                sx={{ marginLeft: "auto !important" }}
              >
                <DeleteIcon />
              </IconButton> */}
            </CardActions>
          </Card>
        );
      })}
    </>
  );
};

export default Cards;
