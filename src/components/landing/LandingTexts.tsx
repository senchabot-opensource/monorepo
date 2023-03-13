import { Grid, Typography } from "@mui/material";
import { env } from "../../env/client.mjs";

const ALT_TEXT = "All Bots and Stream overlays, Manage from one place!";

const LandingTexts = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ pt: { xs: "none", md: "10vh" }, userSelect: "none" }}
    >
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontFamily: "monospace",
          display: { xs: "none", md: "block" },
        }}
      >
        {env.NEXT_PUBLIC_APP_NAME}
      </Typography>
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontFamily: "monospace",
          fontSize: 64,
          display: { xs: "block", md: "none" },
        }}
      >
        {env.NEXT_PUBLIC_APP_NAME}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontFamily: "Source Code Pro",
          display: { xs: "none", md: "block" },
        }}
        textAlign="center"
      >
        {ALT_TEXT}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontFamily: "Source Code Pro",
          display: { xs: "block", md: "none" },
        }}
        textAlign="center"
      >
        {ALT_TEXT}
      </Typography>

      {/*<Typography variant="h5" sx={{ paddingTop: "64px", textAlign: "center" }}>
        WE USE VERCEL. VERCEL USES ANALYTICS SERVICES. WE DO NOT KNOW MUCH ABOUT
        IT. IF YOU ARE STILL HERE AND/OR USING THIS WEB APP, YOU ACCEPT COOKIES
        AND OTHER POLICIES OF VERCEL.
      </Typography>
      <Typography
        variant="h4"
        sx={{
          paddingTop: "32px",
          textAlign: "center",
          display: { xs: "none", md: "block" },
        }}
      >
        TAKE IT OR LEAVE IT.
      </Typography>
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          display: { xs: "block", md: "none" },
        }}
      >
        TAKE IT OR LEAVE IT.
      </Typography>*/}
    </Grid>
  );
};

export default LandingTexts;
