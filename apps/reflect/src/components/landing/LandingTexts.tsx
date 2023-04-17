import { Grid, Typography } from "@mui/material";
import { env } from "../../env/client.mjs";

const ALT_TEXT = "All Bots and Stream overlays, Manage from one place!";
// Stream overlays: #8b5cf6
const LandingTexts = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ pt: { xs: "none", md: "10vh" }, userSelect: "none" }}>
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontFamily: "monospace",
          display: { xs: "none", md: "block" },
        }}>
        <span style={{ color: "#1FAB89" }}>
          {env.NEXT_PUBLIC_APP_NAME.substring(0, 6)}
        </span>
        <span>
          {env.NEXT_PUBLIC_APP_NAME.substring(6, 9).charAt(0).toUpperCase() +
            env.NEXT_PUBLIC_APP_NAME.substring(7, 9)}
        </span>
      </Typography>
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontFamily: "monospace",
          fontSize: 64,
          display: { xs: "block", md: "none" },
        }}>
        <span style={{ color: "#1FAB89" }}>
          {env.NEXT_PUBLIC_APP_NAME.substring(0, 6)}
        </span>
        <span>
          {env.NEXT_PUBLIC_APP_NAME.substring(6, 9).charAt(0).toUpperCase() +
            env.NEXT_PUBLIC_APP_NAME.substring(7, 9)}
        </span>
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontFamily: "Source Code Pro",
          display: { xs: "none", md: "block" },
        }}
        textAlign="center">
        {ALT_TEXT}
      </Typography>

      <Typography
        variant="h6"
        sx={{
          fontFamily: "Source Code Pro",
          display: { xs: "block", md: "none" },
        }}
        textAlign="center">
        {ALT_TEXT}
      </Typography>
    </Grid>
  );
};

export default LandingTexts;
