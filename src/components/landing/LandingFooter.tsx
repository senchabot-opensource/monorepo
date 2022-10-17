import { Typography, Container, Grid, Box, Link, alpha } from "@mui/material";
import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import GitHubIcon from "@mui/icons-material/GitHub";
/*import { grey } from "@mui/material/colors";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import { Offset } from "../Offset";*/

function Copyright() {
  return (
    <React.Fragment>
      <Link color="inherit" href={process.env.NEXTAUTH_URL} underline="none">
        {`${process.env.NEXTAUTH_URL}`}
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
          {/*<Grid item sx={{ display: "flex" }}>
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
          </Grid>*/}
          <Grid item>
            <Copyright />
          </Grid>
        </Grid>
      </Typography>
    </>
  );
};

const LandingFooterS = () => {
  return (
    <>
      <Typography
        component="footer"
        //sx={{ position: "fixed", bottom: 1, display: "flex", width: "100%" }}
        /*sx={{
          position: "relative",
          bottom: 1,
          //left: 8,
          width: "100%",
          display: "flex",
          //bgcolor: alpha("#000", 0.75) //bgcolor: "secondary.light",
        }}*/
      >
        <Container sx={{ my: 2 }}>
          {/*<Grid
            container
            direction="column"
            justifyContent="flex-end"
            spacing={2}
            sx={{ height: 120 }}
          >
            <Grid item xs={6} sm={4} md={2}>
              <Grid item sx={{ display: "flex" }}>
                <Box component="a" href="DOMAIN" sx={iconStyle}>
                  <TwitterIcon />
                </Box>
                <Box component="a" href="DOMAIN" sx={iconStyle}>
                  <GitHubIcon />
                </Box>
              </Grid>
              <Grid item>
                <Copyright />
              </Grid>
            </Grid>
          </Grid>*/}

          <Grid
            container
            direction="row"
            justifyContent="center"
            spacing={2}
            sx={{
              backdropFilter: "blur(5px)",
              backgroundColor: alpha("#000", 0.95),
            }}
          >
            <Grid item>
              <Link
                href="/cookie-policy"
                sx={{
                  /*color: (theme) =>
                        theme.palette.getContrastText(grey[900]),*/

                  color: alpha("#FFF", 0.75),
                  "&:hover": { color: alpha("#FFF", 0.25) },
                }}
                underline="none"
              >
                Cookie Policy
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="/privacy-policy"
                sx={{
                  color: alpha("#FFF", 0.75),
                  "&:hover": { color: alpha("#FFF", 0.25) },
                }}
                underline="none"
              >
                Privacy Policy
              </Link>
            </Grid>
            <Grid item>
              <Link
                href="/terms"
                sx={{
                  color: alpha("#FFF", 0.75),
                  "&:hover": { color: alpha("#FFF", 0.25) },
                }}
                underline="none"
              >
                Terms of Use
              </Link>
            </Grid>
          </Grid>
        </Container>
      </Typography>
    </>
  );
};

export default LandingFooter;
