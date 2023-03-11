import { CssBaseline, Grid, ThemeProvider, Typography } from "@mui/material";
import { AppHeader } from "../components/app";
import LandingAppBar from "../components/landing/LandingAppBar";
import { landingDarkTheme } from "../utils/theme";

const CookiePolicy = () => {
  return (
    <>
      <AppHeader title="Cookie Policy" index={false}></AppHeader>
      <ThemeProvider theme={landingDarkTheme}>
        <CssBaseline />

        <LandingAppBar />

        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          sx={{
            pl: { xs: "10px", md: "16vh" },
            pr: { xs: "none", md: "16vh" },
            pb: { xs: "4px", md: "8px" },
            overflowWrap: "break-word",
            whiteSpace: "pre-line",
          }}
        >
          <Typography variant="h2">Cookie Policy</Typography>

          <Typography variant="h5">
            WE USE VERCEL. VERCEL USES ANALYTICS SERVICES. WE DO NOT KNOW MUCH
            ABOUT IT. IF YOU ARE STILL HERE AND/OR USING THIS WEB APP, YOU
            ACCEPT COOKIES AND OTHER POLICIES OF VERCEL.
          </Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
        </Grid>
      </ThemeProvider>
    </>
  );
};

export default CookiePolicy;
