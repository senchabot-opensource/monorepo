import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  alpha,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import Link from "next/link";
//import LandingButton from "./LandingButton";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { useSession } from "next-auth/react";
import { Offset } from "../Offset";
import { env } from "../../env/client.mjs";
import AppBarTitle from "../common/AppBarTitle";
import LandingButton from "./LandingButton";
import { AppBarStyles, MenuPaperPropsStyles } from "../../styles";
import React from "react";

const appBarMenuList = [
  { title: "Cookie Policy", path: "/cookie-policy" },
  /*{ title: "Privacy Policy", path: "/privacy-policy" },
  { title: "Terms of Service", path: "/terms" },
  { title: "Open Source Licenses", path: "/licenses" },*/
];

const LandingAppBar = () => {
  const { data: session } = useSession();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar
        position="sticky" // adds pb: 8
        color="transparent"
        sx={AppBarStyles}
        elevation={0}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar
            variant="regular"
            sx={{
              userSelect: "none",
            }}
          >
            <LandingButton
              sx={{
                pr: 4,
                display: { xs: "flex", md: "none" },
                color: "#646464",
              }}
              onClick={handleOpenNavMenu}
              disableRipple
            >
              <MenuIcon sx={{ backgroundColor: "#000" }} />
            </LandingButton>
            <Menu
              id="landing-menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
              PaperProps={MenuPaperPropsStyles}
            >
              {appBarMenuList.map((item, index) => (
                <Link key={index} href={item.path}>
                  <MenuItem key={index}>
                    <Typography textAlign="center">{item.title}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
            <AppBarTitle />

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "none", md: "flex" },
              }}
            >
              {appBarMenuList.map((item, index) => (
                <Link key={index} href={item.path}>
                  <LandingButton sx={{ mr: 2, color: "#646464" }} disableRipple>
                    {item.title}
                  </LandingButton>
                </Link>
              ))}
            </Box>

            {/*<Link href="/app">
              {session ? (
                <DashboardIcon
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    "&:hover": { cursor: "pointer" },
                  }}
                />
              ) : (
                <AccountCircle sx={{ "&:hover": { cursor: "pointer" } }} />
              )}
              </Link>*/}
          </Toolbar>
        </Box>
      </AppBar>
      <Offset />
    </>
  );
};

export default LandingAppBar;
