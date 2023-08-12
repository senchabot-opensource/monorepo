import { Typography, Grid, Box, Link } from "@mui/material";
import React from "react";
import { LinkedIn, GitHub, Twitter } from "@mui/icons-material";
import { env } from "../../env/client.mjs";
import LandingButton from "./LandingButton";

const appBarMenuList = [
  { title: "Cookie Policy", path: "/cookie-policy" },
  { title: "Privacy Policy", path: "/privacy-policy" },
  { title: "Terms of Service", path: "/terms" },
  { title: "EULA", path: "/eula" },
  { title: "Credits", path: "/credits" },
];

function Links() {
  return (
    <React.Fragment>
      {appBarMenuList.map((item, index) => (
        <Link key={index} href={item.path} style={{ textDecoration: "none" }}>
          <LandingButton
            sx={{ mr: 2, color: "landingButton.default" }}
            disableRipple>
            {item.title}
          </LandingButton>
        </Link>
      ))}
    </React.Fragment>
  );
}

const iconStyle = {
  width: 48,
  height: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  bgcolor: "landingIcon.background",
  mr: 1,
  "&:hover": {
    backgroundColor: "landingIcon.backgroundHover",
  },
};

const LandingFooter = () => {
  return (
    <>
      <Typography
        component="div"
        sx={{ position: "fixed", bottom: 16, left: 16 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Grid item sx={{ display: "flex" }}>
            <Box
              component="a"
              target="_blank"
              href={env.NEXT_PUBLIC_APP_TWITTER_PROFILE}
              sx={iconStyle}>
              <Twitter />
            </Box>
            <Box
              component="a"
              target="_blank"
              href={env.NEXT_PUBLIC_APP_GITHUB_PROFILE}
              sx={iconStyle}>
              <GitHub />
            </Box>
            <Box
              component="a"
              target="_blank"
              href={env.NEXT_PUBLIC_APP_LINKEDIN_PROFILE}
              sx={iconStyle}>
              <LinkedIn />
            </Box>
          </Grid>
          <Grid item sx={{ display: { xs: "none", md: "block" } }}>
            <Links />
          </Grid>
        </Grid>
      </Typography>
    </>
  );
};

export default LandingFooter;
