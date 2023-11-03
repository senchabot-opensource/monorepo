import { Button, Stack, Typography } from "@mui/material";
import SectionLayout from "../layout/SectionLayout";
import Link from "next/link";
import { AiFillGithub } from "react-icons/ai";

const Hero = () => {
  return (
    <SectionLayout>
      <Stack
        p={2}
        maxWidth="1440px"
        width="100%"
        mt="240px"
        direction={{ xs: "column", md: "row" }}
        alignItems="center">
        <Stack color="#0B0E15" width={{ xs: "100%", md: "50%" }}>
          <Typography fontSize="55px" fontWeight="780" lineHeight="60.50px">
            All Bots and Stream overlays, Manage from one place!
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems="center"
            mt="30px"
            spacing={3}
            p={{ xs: "8px", md: "0px" }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                color: "#ECFFFA",
                fontWeight: "600",
                backgroundColor: "#003B43",
                borderRadius: "20px",
                fontSize: { xs: "24px", md: "16px" },
                padding: "7px 37px",
              }}>
              GET DISCORD BOT
            </Button>
            <Button
              fullWidth
              variant="contained"
              sx={{
                color: "#ECFFFA",
                fontWeight: "600",
                backgroundColor: "#003B43",
                borderRadius: "20px",
                fontSize: { xs: "24px", md: "16px" },
                padding: "7px 37px",
              }}>
              GET TWITCH BOT
            </Button>
          </Stack>
          <Typography
            mt="40px"
            display="flex"
            sx={{ direction: "row", alignItems: "center" }}>
            We’re open source on{" "}
            <Link
              href="#"
              style={{
                textDecoration: "underline",
                marginRight: "2px",
                marginLeft: "2px",
              }}>
              Github
            </Link>
            <AiFillGithub height={24} width={24} />
          </Typography>
        </Stack>
        <Stack width="50%">
          {/* TODO: add image */}
          <img id="img" height={525} width={250} src="" alt="hero" />
        </Stack>
      </Stack>
    </SectionLayout>
  );
};
export default Hero;
