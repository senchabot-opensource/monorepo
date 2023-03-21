import { CssBaseline, Grid, ThemeProvider, Typography } from "@mui/material";
import { AppHeader } from "../components/app";
import LandingAppBar from "../components/landing/LandingAppBar";
import { landingDarkTheme } from "../utils/theme";

const CookiePolicy = () => {
  return (
    <>
      <AppHeader title="Policy Policy" index={false}></AppHeader>
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
          <Typography variant="h4">Privacy Policy for Senchabot</Typography>
          <Typography variant="h5">
            At Senchabot, we take your privacy seriously. This policy outlines
            how we collect, use, and share your personal information.
          </Typography>
          <Typography variant="h5" sx={{ paddingTop: "20px" }}>
            Information We Collect:
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            - User IDs and names on Discord and Twitch
          </Typography>
          <Typography variant="h6">
            - Messages and commands sent to Senchabot
          </Typography>
          <Typography variant="h6">
            -Usage statistics, including time and frequency of use
          </Typography>
          <Typography variant="h5" sx={{ paddingTop: "20px" }}>
            How We Use Your Information:
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            -To provide and improve Senchabot&lsquo;s services
          </Typography>
          <Typography variant="h6">
            -To respond to user inquiries and support requests
          </Typography>
          <Typography variant="h6">
            -To monitor and analyze the performance of Senchabot
          </Typography>
          <Typography variant="h5" sx={{ paddingTop: "20px" }}>
            Information Sharing:
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            - We do not sell or rent your personal information to third parties.
          </Typography>
          <Typography variant="h6">
            - We may share your information with service providers who assist us
            in operating Senchabot.
          </Typography>
          <Typography variant="h6">
            - We may also disclose your information as required by law or to
            comply with legal process.
          </Typography>
          <Typography variant="h5" sx={{ paddingTop: "20px" }}>
            Security:
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            - We take reasonable measures to protect your personal information
            from unauthorized access, use, or disclosure.
          </Typography>
          <Typography variant="h5" sx={{ paddingTop: "20px" }}>
            Data Retention:
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            - We will retain your personal information for as long as necessary
            to provide Senchabot&lsquo;s services or as required by law.
          </Typography>
          <Typography variant="h5" sx={{ paddingTop: "20px" }}>
            Changes to this Policy:
          </Typography>
          <Typography variant="h6" sx={{ paddingTop: "10px" }}>
            - We may update this policy from time to time. The updated policy
            will be posted on Senchabot&lsquo;s website.
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
