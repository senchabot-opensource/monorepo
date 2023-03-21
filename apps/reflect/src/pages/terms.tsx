import { CssBaseline, Grid, ThemeProvider, Typography } from "@mui/material";
import { AppHeader } from "../components/app";
import LandingAppBar from "../components/landing/LandingAppBar";
import { landingDarkTheme } from "../utils/theme";

const CookiePolicy = () => {
  return (
    <>
      <AppHeader title="Terms of Service" index={false}></AppHeader>
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
          {" "}
          {/*<Typography variant="h6">
            Uygulamayı kullanırken tüm sorumluluk kullanıcıya aittir. Hiç bir
            sorumluluk kabul edilmez.
          </Typography>
          <Typography variant="h6">
            Senchabot&lsquo;un kullanımından doğan tüm sonuçlar ve sorumluluklar
            size aittir.
        </Typography>*/}
          <Typography variant="h4">Terms of Service for Senchabot</Typography>
          <Typography variant="h5">
            By using Senchabot, you agree to these terms of service.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            1. Use of Senchabot is at your own risk. We make no warranties or
            guarantees regarding the performance or functionality of Senchabot.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            2. Senchabot is intended for use in accordance with Discord&lsquo;s
            and Twitch&lsquo;s terms of service. We reserve the right to
            terminate access to Senchabot for users who violate these terms.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            3. We reserve the right to modify or discontinue Senchabot at any
            time without notice.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            4. Senchabot may include links to third-party websites or services.
            We are not responsible for the content or functionality of these
            websites or services.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            5. Senchabot may not be used for illegal purposes or to harass,
            intimidate, or threaten others.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            6. We reserve the right to modify these terms of service at any
            time. Your continued use of Senchabot after any modifications to the
            terms indicates your acceptance of the modified terms.
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            7.
          </Typography>
          {/*<Typography variant="h2">Terms of Service for Senchabot</Typography>
          <Typography variant="h5">
            WE USE VERCEL. VERCEL USES ANALYTICS SERVICES. WE DO NOT KNOW MUCH
            ABOUT IT. IF YOU ARE STILL HERE AND/OR USING THIS WEB APP, YOU
            ACCEPT COOKIES AND OTHER POLICIES OF VERCEL.
          </Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          <Typography variant="h1">TAKE IT OR LEAVE IT.</Typography>
          */}
        </Grid>
        <Typography sx={{ position: "fixed", bottom: 16, right: 16 }}>
          pre-alpha
        </Typography>
      </ThemeProvider>
    </>
  );
};

export default CookiePolicy;
