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
            pb: { xs: "4px", md: "128px" },
            overflowWrap: "break-word",
            whiteSpace: "pre-line",
          }}
        >
          {/*<Typography variant="h2">Cookie Policy for Senchabot</Typography>

          <Typography variant="h5">
            WE USE VERCEL. VERCEL USES ANALYTICS SERVICES. WE DO NOT KNOW MUCH
            ABOUT IT. IF YOU ARE STILL HERE AND/OR USING THIS WEB APP, YOU
            ACCEPT COOKIES AND OTHER POLICIES OF VERCEL.
          </Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h6">
            Uygulamayı kullanırken tüm sorumluluk kullanıcıya aittir. Hiç bir
            sorumluluk kabul etmiyoruz
          </Typography>*/}
          <Typography variant="h4">Cookie Policy for Senchabot</Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            Senchabot uses cookies to enhance the user experience and improve
            the performance of the bot. By using Senchabot, you consent to the
            use of cookies in accordance with this policy.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            Cookies are small text files that are placed on your device when you
            use Senchabot. They allow Senchabot to remember your preferences and
            help us analyze how you use the bot. This information is used to
            improve the user experience and provide better services.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            Senchabot uses both session cookies and persistent cookies. Session
            cookies are temporary and are deleted when you close your browser,
            while persistent cookies remain on your device until they expire or
            you delete them.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            You can control the use of cookies at the individual browser level.
            If you choose to disable cookies, some features of Senchabot may not
            function properly.
          </Typography>
        </Grid>
        <Typography sx={{ position: "fixed", bottom: 16, right: 16 }}>
          pre-alpha
        </Typography>
      </ThemeProvider>
    </>
  );
};

export default CookiePolicy;
