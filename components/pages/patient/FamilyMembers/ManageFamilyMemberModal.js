import React from "react";

import {
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { FormikProvider, useFormik } from "formik";

import { useResponseDialog } from "../../../../contexts/ResponseDialogContext";
import { formatDate } from "../../../../modules/helper";
import { FamilyMemberSchema } from "../../../../modules/validation";
import Form from "./Form";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const defaultValues = {
  familyMembers: [],
};

const ManageFamilyMemberModal = ({
  open,
  setOpen,
  onCheckDuplicate,
  onAddMemeber,
}) => {
  const isMobileView = useMediaQuery((theme) => theme.breakpoints.only("xs"));
  const { openResponseDialog } = useResponseDialog();

  const formik = useFormik({
    initialValues: defaultValues,
    validationSchema: FamilyMemberSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      // automatic unverified family member
      const { familyMembers } = values;

      const dupliNames = []; // used for error display

      // Check Duplicates
      const hasDuplicate = familyMembers.reduce((acc, i) => {
        const { firstName, middleName, lastName, birthdate } = i;
        const fullname = `${firstName} ${middleName} ${lastName}`;

        const m = `${fullname} ${formatDate(birthdate)}`;
        const isDupli = onCheckDuplicate(m);

        if (isDupli) dupliNames.push(fullname);

        return acc || isDupli;
      }, false);

      if (hasDuplicate) {
        openResponseDialog({
          content: (
            <>
              <Typography variant="body1">Duplicate Family Members</Typography>
              <Typography variant="body2">{dupliNames.join(", ")}</Typography>
            </>
          ),
          type: "WARNING",
        });

        return;
      }

      onAddMemeber(familyMembers);
    },
  });

  const { handleSubmit, values, resetForm } = formik;

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <Dialog
      fullScreen={isMobileView}
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ overflow: "overlay" }}
      >
        <AppBar sx={{ position: "sticky" }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Add Family Member
              </Typography>

              <Button
                color="inherit"
                sx={{ mr: 2 }}
                type="submit"
                disabled={values.familyMembers.length === 0}
              >
                save
              </Button>
              <Button color="inherit" onClick={handleClose}>
                Cancel
              </Button>
            </Toolbar>
          </Container>
        </AppBar>
        <Box sx={{ py: 2 }}>
          <FormikProvider value={formik}>
            <Container maxWidth="lg">
              <Form {...formik} />
            </Container>
          </FormikProvider>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ManageFamilyMemberModal;
