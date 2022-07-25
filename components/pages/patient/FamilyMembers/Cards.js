import React from "react";

import EditIcon from "@mui/icons-material/Edit";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  formatDate,
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
          ? MEMBER_STATUS.VERFIED
          : !verificationAttachment
          ? MEMBER_STATUS.FOR_VERIFICATION
          : verificationAttachment && verificationRejectReason
          ? MEMBER_STATUS.REJECTED
          : MEMBER_STATUS.FOR_APPROVAL;
        return (
          <Card key={index} sx={{ width: { xs: "100%", md: 370 } }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "primary.main" }} aria-label="recipe">
                  {getInitials(firstName)}
                </Avatar>
              }
              action={
                <>
                  <IconButton size="small" onClick={() => onEditModal(i)}>
                    <EditIcon />
                  </IconButton>
                  {statusUploadAllowed.includes(status) && (
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => onVerificationModal(i)}
                    >
                      <UploadFileIcon />
                    </IconButton>
                  )}
                  {status === MEMBER_STATUS.VERFIED && !verifiedContactNo && (
                    <IconButton
                      size="small"
                      color="primary"
                      component="label"
                      onClick={() => onPhoneModal(i)}
                    >
                      <PhoneIphoneIcon />
                    </IconButton>
                  )}
                </>
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
            <CardContent sx={{ pt: 0 }}>
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
                  {formatDate(birthdate, "MMMM dd, yyyy")}
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

              <Typography variant="body2" color="text.secondary">
                {address}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default Cards;
