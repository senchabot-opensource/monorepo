import React from "react";
import type { NextPage } from "next";
import { ThemeProvider } from "@mui/material/styles";
import { landingDarkTheme } from "../utils/theme";
import {
  CssBaseline,
  Typography,
  Toolbar,
  Box,
  Paper,
  Grid,
} from "@mui/material";
import Link from "next/link";
//import { styled } from "@mui/material/styles";
import AppHeader from "../components/app/AppHeader";
import LandingAppBar from "../components/landing/LandingAppBar";
import LandingFooter from "../components/landing/LandingFooter";

/*const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#000",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));*/

const Landing: NextPage = () => {
  return (
    <>
      <AppHeader title="Web App" index={true} />
      <ThemeProvider theme={landingDarkTheme}>
        <CssBaseline />
        <LandingAppBar />
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ p: "10vh", userSelect: "none" }}
        >
          {/*<Typography
            variant="h1"
            component="div"
            sx={{
              fontFamily: "monospace",
              display: { xs: "none", md: "block" },
            }}
          >
            abc
          </Typography>
          <Typography
            variant="h1"
            component="div"
            sx={{
              fontFamily: "monospace",
              fontSize: 50,
              display: { xs: "block", md: "none" },
            }}
          >
            def
          </Typography>
          */}

          <Typography variant="h2">Work in progress</Typography>
        </Grid>

        {/*<animated.div style={styles}>
          <Typography
            variant="h1"
            component="div"
            sx={{ flexGrow: 1, fontFamily: "Source Code Pro" }}
          >
            Abc
          </Typography>
        </animated.div>*/}
        <Typography sx={{ position: "fixed", bottom: 16, right: 16 }}>
          pre-alpha
        </Typography>

        {/*<Typography sx={{ position: "fixed", justifyContent: "center" }}>
          XXXXXXXXXXX
        </Typography>*/}

        <LandingFooter />
      </ThemeProvider>
    </>
  );
};

//test('should first', () => { second })
export default Landing;
