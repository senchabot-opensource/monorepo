import { Grid, Typography } from "@mui/material";
import { env } from "../../env/client.mjs";

const LandingTexts = () => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      alignItems="center"
      sx={{ pt: "10vh", userSelect: "none" }}
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
          fontSize: 50,
          display: { xs: "block", md: "none" },
        }}
      >
        {env.NEXT_PUBLIC_APP_NAME}
      </Typography>

      <Typography variant="h1" sx={{ fontFamily: "Source Code Pro" }}>
        Work in progress
      </Typography>
    </Grid>
  );
};

export default LandingTexts;
