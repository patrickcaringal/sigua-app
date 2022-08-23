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
  SKIPPED_DOCTOR: "SKIPPED_DOCTOR",
  DOCTOR_DONE: "DOCTOR_DONE",
  DOCTOR_QUEQUE: "DOCTOR_QUEQUE",
};

const TransferModal = ({ open, data, doctors, onTransferSelect, onClose }) => {
  // const showDoctors = data.from !== "doctor";
  const fromQueue = data.from === "queue";
  const fromDoctor = data.from.includes("counters");

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TRANSFER PATIENT TO</DialogTitle>
      {!fromDoctor && (
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
                    flow: fromQueue
                      ? QUEUE_FLOW.QUEUE_DOCTOR
                      : QUEUE_FLOW.SKIPPED_DOCTOR,
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
      {fromQueue && (
        <>
          <Divider />
          <List sx={{ pt: 0 }}>
            <ListItem
              button
              onClick={() => {
                onTransferSelect({
                  ...data,
                  to: "skipped",
                  flow: fromQueue
                    ? QUEUE_FLOW.QUEUE_SKIPPED
                    : QUEUE_FLOW.DOCTOR_SKIPPED,
                });
                handleClose();
              }}
            >
              <ListItemText primary="Skipped" sx={{ textAlign: "center" }} />
            </ListItem>
          </List>
        </>
      )}

      {fromDoctor && (
        <>
          <Divider />
          <List sx={{ pt: 0 }}>
            <ListItem
              button
              onClick={() => {
                onTransferSelect({
                  ...data,
                  to: "queue",
                  flow: QUEUE_FLOW.DOCTOR_QUEQUE,
                });
                handleClose();
              }}
            >
              <ListItemText primary="Queue" sx={{ textAlign: "center" }} />
            </ListItem>
          </List>
        </>
      )}
    </Dialog>
  );
};

export default TransferModal;
