import React, { useContext, useState } from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { MenuPaperPropsStyles } from "../../styles";
import { DarkMode, LightMode } from "@mui/icons-material";
import { ColorModeContext } from "src/Context/ColorModeContext";

const AccountMenu = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        <IconButton
          onClick={toggleColorMode}
          sx={{
            color: "landingButton.default",
          }}>
          {colorMode === "dark" ? (
            <LightMode
              sx={{
                backgroundColor: "landingDashboardIcon.background",
                color: "landingDashboardIcon.default",
              }}
            />
          ) : (
            <DarkMode
              sx={{
                backgroundColor: "landingDashboardIcon.background",
                color: "landingDashboardIcon.default",
              }}
            />
          )}
        </IconButton>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="medium"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}>
            <AccountCircleIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={MenuPaperPropsStyles}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
        <MenuItem>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>{" "}
          {session && session.user?.name}
        </MenuItem>
        <Link href="/app/settings">
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>
        <MenuItem
          onClick={() =>
            signOut({
              callbackUrl: window.location.origin,
            })
          }>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default AccountMenu;
