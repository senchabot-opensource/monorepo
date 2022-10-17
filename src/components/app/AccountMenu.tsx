import React from "react";
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  alpha,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
//import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const AccountMenu = () => {
  const { data: session } = useSession();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="medium"
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            {/*<Avatar
              sx={{
                width: 28,
                height: 28,
              }}
            >
              {session && session.user?.name?.charAt(0).toLocaleUpperCase()}
            </Avatar>*/}
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
        PaperProps={{
          elevation: 1,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px, 2px, 8px rgba(0,0,0,0.32))",
            boxShadow:
              "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
            backdropFilter: "blur(5px)",
            backgroundColor: "inherit",
            mt: 1,

            "& .MuiAvatar-root": {
              width: 28,
              height: 28,
              ml: -0.5,
              mr: 1.5,
            },
            /*"&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },*/
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
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
          }
        >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

/*
<Box>
            <Box sx={{ flexGrow: 0 }}>



            {true ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton
                    aria-label="account of current user"
                    onClick={handleOpenUserMenu}
                    sx={{ p: 0 }}
                  >
                    <AccountCircleIcon />


                    sx={{ color: "#fff", backgroundColor: "#000" }}



                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">
                      {session?.user?.name}
                    </Typography>
                  </MenuItem>
                  {settings.map((setting, index) => (
                    <Link key={index} href="/app/settings">
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    </Link>
                  ))}
                  <MenuItem
                    onClick={() =>
                      signOut({
                        callbackUrl: window.location.origin,
                      })
                    }
                  >
                    <Typography textAlign="center">Sign out</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <AuthDialog />
            )}
          </Box> */
