import * as React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Dialog,

  //alpha,
} from "@mui/material";

import { useRouter } from "next/router";
import { AuthContainer } from "./AuthContainer";

export interface DialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

export default function AuthDialog() {
  //const { data } = useSession();
  const [open, setOpen] = React.useState(false);

  const handleToggleAuthMenu = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <Tooltip title="Sign in/up">
        <IconButton
          aria-label="account of current user"
          onClick={handleToggleAuthMenu}
          sx={{ p: 0 }}
        >
          {/*<Avatar sx={{ backgroundColor: alpha("#fff", 0.25) }} />*/}
          <AccountCircleIcon sx={{ color: "#b2b2b2" }} />
        </IconButton>
      </Tooltip>
      <Dialog onClose={handleToggleAuthMenu} open={open}>
        <AuthContainer />
      </Dialog>
    </>
  );
}
