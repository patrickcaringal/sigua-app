import React, { useEffect, useState } from "react";

import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Input,
  Typography,
} from "@mui/material";
import dynamic from "next/dynamic";
import Image from "next/image";
const ReactViewer = dynamic(() => import("react-viewer"), { ssr: false });

const MemberApprovalModal = ({ data, open, onClose }) => {
  const { src = "", requester, member } = data || {};

  const [viewerOpen, setViewerOpen] = useState(false);

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
              {member}
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
          <Fab
            size="small"
            color="primary"
            sx={{ position: "absolute", bottom: 70, right: 16 }}
            onClick={handleViewerOpen}
          >
            <ImageSearchIcon />
          </Fab>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={() => {}} variant="outlined" color="success">
            Approve
          </Button>
          <Button onClick={() => {}} variant="outlined" color="error">
            Reject
          </Button>
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
