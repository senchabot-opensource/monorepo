import { Typography, Grid, Box, Link } from "@mui/material";
import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
import { env } from "../../env/client.mjs";

function Copyright() {
  return (
    <React.Fragment>
      <Link color="inherit" href={env.NEXT_PUBLIC_APP_URL} underline="none">
        {`${env.NEXT_PUBLIC_APP_NAME}`}
      </Link>{" "}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  bgcolor: "#000000",
  mr: 1,
  "&:hover": {
    backgroundColor: "#0c0c0c",
  },
};

const LandingFooter = () => {
  return (
    <>
      <Typography
        component="div"
        sx={{ position: "fixed", bottom: 16, left: 16 }}
      >
        <Grid item xs={6} sm={4} md={2}>
          <Grid item sx={{ display: "flex" }}>
            <Box
              component="a"
              target="_blank"
              href="https://twitter.com/"
              sx={iconStyle}
            >
              <TwitterIcon />
            </Box>
            <Box
              component="a"
              target="_blank"
              href="https://github.com/"
              sx={iconStyle}
            >
              <GitHubIcon />
            </Box>
          </Grid>
          <Grid item>
            <Copyright />
          </Grid>
        </Grid>
      </Typography>
    </>
  );
};

export default LandingFooter;
