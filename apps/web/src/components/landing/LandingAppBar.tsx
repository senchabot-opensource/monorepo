import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Button,
} from "@mui/material";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuIcon from "@mui/icons-material/Menu";
import { LightMode } from "@mui/icons-material";
import { DarkMode } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { Offset } from "../Offset";
import Logo from "../common/Logo";
import LandingButton from "./LandingButton";
import { MenuPaperPropsStyles } from "../../styles";
import React, { useContext, useState } from "react";
import { ColorModeContext } from "src/Context/ColorModeContext";

const appBarMenuList = [
  { title: "Cookie Policy", path: "/cookie-policy" },
  { title: "Privacy Policy", path: "/privacy-policy" },
  { title: "Terms of Service", path: "/terms" },
  { title: "EULA", path: "/eula" },
  { title: "Credits", path: "/credits" },
];

const toolBarStyles = {
  justifyContent: "space-between",
  alignItems: "center",
};

const LandingAppBar = () => {
  const { data: session } = useSession();
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const { colorMode, toggleColorMode } = useContext(ColorModeContext);

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
        elevation={0}>
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar
            style={toolBarStyles}
            variant="regular"
            sx={{
              backgroundColor: "landingAppBar.background",
              backdropFilter: "blur(4px)",
              userSelect: "none",
            }}>
            <LandingButton
              sx={{
                pr: 4,
                display: { xs: "flex", md: "none" },
                color: "landingButton.default",
              }}
              onClick={handleOpenNavMenu}
              disableRipple>
              <MenuIcon />
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
              PaperProps={MenuPaperPropsStyles}>
              {appBarMenuList.map((item, index) => (
                <Link key={index} href={item.path}>
                  <MenuItem key={index}>
                    <Typography textAlign="center" fontStyle="italic">
                      {item.title}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
            <Logo />
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
              {session ? (
                <Button
                  href="/app"
                  sx={{
                    backgroundColor: "landingDashboardIcon.background",
                    color: "landingDashboardIcon.default",
                    "&:hover": { cursor: "pointer" },
                  }}>
                  Dashboard
                </Button>
              ) : (
                <Button
                  href="/app"
                  sx={{
                    ml: 1,
                    color: "gray",
                  }}>
                  join now
                </Button>
              )}
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
      <Offset />
    </>
  );
};

export default LandingAppBar;
