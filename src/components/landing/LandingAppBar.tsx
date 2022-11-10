import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  alpha,
  IconButton,
} from "@mui/material";
import Link from "next/link";
//import LandingButton from "./LandingButton";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useSession } from "next-auth/react";
import { Offset } from "../Offset";
import { env } from "../../env/client.mjs";
import AppBarTitle from "../common/AppBarTitle";

const LandingAppBar = () => {
  const { data: session } = useSession();

  return (
    <>
      <AppBar
        position="sticky" // adds pb: 8
        color="transparent"
        sx={{
          backdropFilter: "blur(1px)",
          backgroundColor: alpha("#000", 0.75),
        }}
        elevation={0}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Toolbar
            variant="regular"
            sx={{
              userSelect: "none",
            }}
          >
            <AppBarTitle />

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {/*<Link href="/cookie-policy">
                <LandingButton sx={{ mr: 2, color: "#646464" }} disableRipple>
                  Cookie Policy
                </LandingButton>
              </Link>

              <Link href="/privacy-policy">
                <LandingButton sx={{ mr: 2, color: "#646464" }} disableRipple>
                  Privacy Policy
                </LandingButton>
              </Link>
              <Link href="/terms">
                <LandingButton sx={{ mr: 2, color: "#646464" }} disableRipple>
                  Terms of Service
                </LandingButton>
              </Link>
              <Link href="/licenses">
                <LandingButton sx={{ mr: 10, color: "#646464" }} disableRipple>
                  Open Source Licenses
                </LandingButton>
              </Link>*/}
            </Box>

            <Link href="/app">
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
            </Link>
          </Toolbar>
        </Box>
      </AppBar>
      <Offset />
    </>
  );
};

export default LandingAppBar;
