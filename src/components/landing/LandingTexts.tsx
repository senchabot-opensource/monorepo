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
          fontSize: 64,
          display: { xs: "block", md: "none" },
        }}
      >
        {env.NEXT_PUBLIC_APP_NAME}
      </Typography>

      <Typography
        variant="h3"
        sx={{
          fontFamily: "Source Code Pro",
          display: { xs: "none", md: "block" },
        }}
      >
        Work in progress
      </Typography>

      <Typography
        variant="h5"
        sx={{
          fontFamily: "Source Code Pro",
          display: { xs: "block", md: "none" },
        }}
      >
        Work in progress
      </Typography>
    </Grid>
  );
};

export default LandingTexts;
