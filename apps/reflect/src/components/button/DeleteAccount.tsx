import React, { forwardRef, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Slide } from "@mui/material";
import { styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  alpha,
} from "@mui/material";
import { red } from "@mui/material/colors";
import { trpc } from "../../utils/trpc";
import { signOut } from "next-auth/react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const RedButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(red[500]),
  backgroundColor: alpha("#ff0000", 0.4),
  "&:hover": {
    backgroundColor: red[900],
  },
}));

const DeleteAccount = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAccountMutation = trpc.security.deleteMyAccount.useMutation({
    onSuccess() {
      signOut();
      alert("Account(s) deleted. You will be redirected.");
    },
  });

  const handleDeleteButton = () => deleteAccountMutation.mutate();

  return (
    <>
      <RedButton variant="contained" onClick={handleOpen} disableElevation>
        Delete my account
      </RedButton>
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
