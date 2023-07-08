import React, { forwardRef, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { signOut } from "next-auth/react";
import { deleteAccount } from "src/api";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteAccount = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteButton = () => {
    deleteAccount().then(res => {
      if (res.succcess) {
        signOut();
        alert("Account(s) deleted. You will be redirected.");
      }
    });
  };

  return (
    <>
      <Button
        sx={{
          backgroundColor: "deleteAccountBtn.default",
          "&:hover": {
            backgroundColor: "deleteAccountBtn.hover",
          },
        }}
        variant="contained"
        onClick={handleOpen}
        disableElevation>
        Delete my account
      </Button>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="delete-account-dialog">
        <DialogTitle>{"Delete Account"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-account-dialog">
            Are you sure you want to delete your account(s)?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDeleteButton} color="error">
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAccount;
