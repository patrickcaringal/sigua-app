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
  QUEUE_NEXT: "QUEUE_NEXT",
  QUEUE_DOCTOR: "QUEUE_DOCTOR",
  QUEUE_SKIPPED: "QUEUE_SKIPPED",
  NEXT_SKIPPED: "NEXT_SKIPPED",
  NEXT_DOCTOR: "NEXT_DOCTOR",
  SKIPPED_DOCTOR: "SKIPPED_DOCTOR",
  SKIPPED_NEXT: "SKIPPED_NEXT",
  DOCTOR_DONE: "DOCTOR_DONE",
  DOCTOR_QUEQUE: "DOCTOR_QUEQUE",
};

const TransferModal = ({ open, data, doctors, onTransferSelect, onClose }) => {
  const fromQueue = data.from === "queue";
  const fromNext = data.from === "next";
  const fromSkipped = data.from === "skipped";
  const fromDoctor = data.from.includes("counters");

  const showNext = ["queue", "skipped"].includes(data.from);
  const showSkipped = ["next"].includes(data.from);
  const showDoctor = ["next"].includes(data.from);

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>TRANSFER PATIENT TO</DialogTitle>
      {/* TO DOCTOR */}
      {showDoctor && (
        <List sx={{ pt: 0 }}>
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
                    flow: QUEUE_FLOW.NEXT_DOCTOR,
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

      {/* TO NEXT */}
      {showNext && (
        <>
          <Divider />
          <List sx={{ pt: 0 }}>
            <ListItem
              button
              onClick={() => {
                onTransferSelect({
                  ...data,
                  to: "next",
                  flow: QUEUE_FLOW.QUEUE_NEXT,
                });
                handleClose();
              }}
            >
              <ListItemText primary="Next" sx={{ textAlign: "center" }} />
            </ListItem>
          </List>
        </>
      )}

      {/* TO SKIPPED */}
      {showSkipped && (
        <>
          <List sx={{ pt: 0 }}>
            <ListItem
              button
              onClick={() => {
                onTransferSelect({
                  ...data,
                  to: "skipped",
                  flow: QUEUE_FLOW.NEXT_SKIPPED,
                  // fromQueue
                  //   ? QUEUE_FLOW.QUEUE_SKIPPED
                  //   : QUEUE_FLOW.DOCTOR_SKIPPED,
                });
                handleClose();
              }}
            >
              <ListItemText primary="Skipped" sx={{ textAlign: "center" }} />
            </ListItem>
          </List>
        </>
      )}

      {/* TO QUEQUE */}
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
