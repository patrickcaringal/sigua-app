import * as React from "react";

import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { blue } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

const BranchesDialog = ({ open, data = [], onBranchClick, onClose }) => {
  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value) => {
    onBranchClick(value);
    handleClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>SELECT A BRANCH</DialogTitle>
      <List sx={{ pt: 0 }}>
        {data.map((i) => {
          const { id, name } = i;

          return (
            <ListItem button onClick={() => handleListItemClick(id)} key={id}>
              <ListItemText primary={name} sx={{ textAlign: "center" }} />
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
};

export default BranchesDialog;
