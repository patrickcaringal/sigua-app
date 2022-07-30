import { createContext, useContext, useState } from "react";

import { ResponseDialog } from "../components";

const ResponseDialogContext = createContext({});

export const DIALOG_TYPES = {
  SUCCESS: "SUCCESS",
  WARNING: "WARNING",
  ERROR: "ERROR",
};

export const useResponseDialog = () => useContext(ResponseDialogContext);

export const ResponseDialogProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState(DIALOG_TYPES.SUCCESS);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [actions, setActions] = useState(null);

  const handleClose = () => {
    setOpen(false);

    // slight delay
    setTimeout(() => {
      setType(DIALOG_TYPES.SUCCESS);
      setTitle(null);
      setContent(null);
      setActions(null);
    }, 250);
  };

  const openResponseDialog = ({
    autoClose = false,
    content,
    actions,
    type,
    closeCb = () => {},
  }) => {
    setType(type);
    setContent(content);
    setActions(actions);
    setOpen(true);
    closeCb();

    if (autoClose) {
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    }
  };

  const openErrorDialog = (content = "") => {
    setType("ERROR");
    setContent(content);
    setOpen(true);
  };

  const value = { openErrorDialog, openResponseDialog };
  return (
    <ResponseDialogContext.Provider value={value}>
      <ResponseDialog
        open={open}
        type={type}
        title={title}
        content={content}
        actions={actions}
        onClose={handleClose}
      />
      {children}
    </ResponseDialogContext.Provider>
  );
};
