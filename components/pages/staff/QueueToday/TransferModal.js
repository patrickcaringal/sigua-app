import React from "react";

import {
  Dialog,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";

export const QUEUE_FLOW = {
  QUEUE_DOCTOR: "QUEUE_DOCTOR",
  QUEUE_SKIPPED: "QUEUE_SKIPPED",
  DOCTOR_DONE: "DOCTOR_DONE",
};

const TransferModal = ({ open, data, doctors, onTransferSelect, onClose }) => {
  const showDoctors = data.from !== "doctor";
  const showSkipped = data.from === "queue";

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TRANSFER PATIENT TO</DialogTitle>
      {showDoctors && (
        <List sx={{ pt: 0 }}>
          {/* Doctors */}
          {doctors.map((i) => {
            const { id, name } = i;
            return (
              <ListItem
                button
                onClick={() => {
                  onTransferSelect({
                    ...data,
                    doctor: i,
                    to: `counters.${id}.queue`,
                    flow: QUEUE_FLOW.QUEUE_DOCTOR,
                  });
                  handleClose();
                }}
                key={id}
              >
                <ListItemText primary={name} sx={{ textAlign: "center" }} />
              </ListItem>
            );
          })}
        </List>
      )}

      {showSkipped && (
        <>
          <Divider />
          <List sx={{ pt: 0 }}>
            <ListItem
              button
              onClick={() => {
                onTransferSelect({
                  ...data,
                  to: "skipped",
                  flow: QUEUE_FLOW.QUEUE_SKIPPED,
                });
                handleClose();
              }}
            >
              <ListItemText primary="Skipped" sx={{ textAlign: "center" }} />
            </ListItem>
          </List>
        </>
      )}
    </Dialog>
  );
};

export default TransferModal;
