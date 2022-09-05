import React from "react";

import { Dialog, Slide } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Modal = ({ children, width = "sm", open, onClose }) => {
  const isMobileView = useMediaQuery((theme) => theme.breakpoints.only("xs"));

  return (
    <Dialog
      fullScreen={isMobileView}
      fullWidth
      maxWidth={width}
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      {children}
    </Dialog>
  );
};

export default Modal;
