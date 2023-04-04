import React from "react";
import type { NextPage } from "next";
import { ThemeProvider } from "@mui/material/styles";
import { landingDarkTheme } from "../utils/theme";
import { CssBaseline, Typography } from "@mui/material";
import AppHeader from "../components/app/AppHeader";
import LandingAppBar from "../components/landing/LandingAppBar";
import LandingTexts from "../components/landing/LandingTexts";
import LandingFooter from "../components/landing/LandingFooter";

const Landing: NextPage = () => {
  return (
    <>
      <AppHeader title="Landing" index={true} />
      <ThemeProvider theme={landingDarkTheme}>
        <CssBaseline />
        <LandingAppBar />
        <LandingTexts />

        <Typography sx={{ position: "fixed", bottom: 16, right: 16 }}>
          pre-alpha
        </Typography>

        <LandingFooter />
      </ThemeProvider>
    </>
  );
};

export default Landing;
