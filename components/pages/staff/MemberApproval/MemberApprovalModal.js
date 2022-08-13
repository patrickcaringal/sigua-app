import React, { useState } from "react";

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import Image from "next/image";

import { VerificationRejectSchema } from "../../../../modules/validation";
import { Input } from "../../../common";

const ReactViewer = dynamic(() => import("react-viewer"), { ssr: false });

const MemberApprovalModal = ({ data, open, onClose, onApprove, onReject }) => {
  const { verificationAttachment: src, accountName: requester, name } = data;

  const formik = useFormik({
    initialValues: {
      verificationRejectReason: "",
    },
    validationSchema: VerificationRejectSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const { verificationRejectReason } = values;

      onReject({
        ...data,
        verificationRejectReason,
      });
    },
  });
  const {
    handleChange,
    handleBlur,
    values,
    errors,
    touched,
    resetForm,
    submitForm,
  } = formik;

  const [viewerOpen, setViewerOpen] = useState(false);
  const [rejectInputShown, setRejectInputShown] = useState(false);

  const dialogOpen = viewerOpen ? false : open;
  const image = [
    {
      src: src,
      alt: "",
    },
  ];

  const handleViewerOpen = () => {
    setViewerOpen(true);
  };

  const handleViewerClose = () => {
    setViewerOpen(false);
  };

  const handleClose = () => {
    onClose();
    handleCancelReject();
  };

  const handleApprove = () => {
    onApprove(data);
  };

  const handleReject = () => {
    setRejectInputShown(true);
  };

  const handleCancelReject = () => {
    setRejectInputShown(false);
    resetForm();
  };

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle id="alert-dialog-title">
          Member Verification Approval
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Requester
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              {requester}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              Member
            </Typography>
            <Typography variant="caption" display="block">
              {name}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 400,
              width: 396,
            }}
          >
            {src && (
              <Image
                src={src}
                alt=""
                width="100%"
                height="100%"
                layout="responsive"
                objectFit="contain"
              />
            )}
          </Box>
          {rejectInputShown && (
            <Input
              sx={{ mt: 2 }}
              required
              label="Rejection reason"
              value={values.verificationRejectReason}
              name="verificationRejectReason"
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.verificationRejectReason &&
                errors.verificationRejectReason
              }
            />
          )}
          <Fab
            size="small"
            color="primary"
            sx={{ position: "absolute", bottom: 100, right: 16 }}
            onClick={handleViewerOpen}
          >
            <ImageSearchIcon />
          </Fab>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          {!rejectInputShown && (
            <>
              <Button
                onClick={handleApprove}
                variant="outlined"
                color="success"
              >
                Approve
              </Button>
              <Button onClick={handleReject} variant="outlined" color="error">
                Reject
              </Button>
            </>
          )}
          {rejectInputShown && (
            <>
              <Button onClick={handleCancelReject}>Cancel</Button>
              <Button onClick={submitForm} variant="outlined" color="error">
                Proceed Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <ReactViewer
        visible={viewerOpen}
        onClose={handleViewerClose}
        images={image}
        zIndex={2000}
        zoomSpeed={0.2}
        attribute={false}
        rotatable={false}
        downloadable={false}
        scalable={false}
        changeable={false}
        loop={false}
      />
    </>
  );
};

export default MemberApprovalModal;
