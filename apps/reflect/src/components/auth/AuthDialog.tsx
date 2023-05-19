import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Dialog } from "@mui/material";
import AuthContainer from "./AuthContainer";

export interface DialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const AuthDialog = () => {
  const [open, setOpen] = useState(false);

  const handleToggleAuthMenu = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      <Tooltip title="Sign in/up">
        <IconButton
          aria-label="account of current user"
          onClick={handleToggleAuthMenu}
          sx={{ p: 0 }}>
          <AccountCircleIcon sx={{ color: "#b2b2b2" }} />
        </IconButton>
      </Tooltip>
      <Dialog onClose={handleToggleAuthMenu} open={open}>
        <AuthContainer />
      </Dialog>
    </>
  );
};

export default AuthDialog;
