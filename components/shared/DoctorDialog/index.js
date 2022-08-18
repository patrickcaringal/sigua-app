import * as React from "react";

import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const DoctorDialog = ({ open, data = [], onItemClick, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    onItemClick(value);
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>SELECT A DOCTOR</DialogTitle>
      <List sx={{ pt: 0 }}>
        {data.map((i) => {
          const { id, name } = i;

          return (
            <ListItem button onClick={() => handleListItemClick(i)} key={id}>
              <ListItemText primary={name} sx={{ textAlign: "center" }} />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};

export default DoctorDialog;
