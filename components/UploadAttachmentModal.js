import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Input,
} from "@mui/material";
import Image from "next/image";

export default function UploadAttachmentModal() {
  const [open, setOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSelectFile = (e) => {
    console.log("onSelectFile");
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle id="alert-dialog-title">
        Upload Verification Attachment
      </DialogTitle>
      <DialogContent>
        {selectedFile && preview && (
          <Image
            src={preview}
            alt=""
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
          />
        )}

        <label htmlFor="contained-button-file">
          <Input
            sx={{ display: "none" }}
            accept="image/*"
            id="contained-button-file"
            type="file"
            onChange={onSelectFile}
          />
          <Button variant="contained" component="span">
            choose image
          </Button>
        </label>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Disagree</Button>
        <Button onClick={handleClose}>Agree</Button>
      </DialogActions>
    </Dialog>
  );
}
