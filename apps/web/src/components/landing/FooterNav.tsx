import { Stack, Typography } from "@mui/material";
import SectionLayout from "./layout/SectionLayout";
import Link from "next/link";
import {
  SiTwitch,
  SiTwitter,
  SiDiscord,
  SiLinkedin,
  SiGithub,
} from "react-icons/si";

const FooterNav = () => {
  return (
    <SectionLayout>
      <Stack
        pt="103px"
        pb="103px"
        width="100%"
        maxWidth="1440px"
        justifyContent="center"
        color="#0B0E15">
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          color="#0B0E15">
          <Stack>
            <Typography color="#20AB8C" fontSize="32px" fontWeight="900">
              Senchabot
            </Typography>
            <Typography mt="12px" fontWeight={400}>
              All Bots and Stream overlays, Manage from one place!
            </Typography>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link href="#">
                <SiTwitter size="24px" />
              </Link>
              <Link href="#">
                <SiTwitch size="24px" />
              </Link>
              <Link href="#">
                <SiDiscord size="24px" />
              </Link>
              <Link href="#">
                <SiGithub size="24px" />
              </Link>
              <Link href="#">
                <SiLinkedin size="24px" />
              </Link>
            </Stack>
          </Stack>
          <Stack spacing={1.5}>
            <Typography fontWeight="bold">PRODUCT</Typography>
            <Link href="#">Dashboard</Link>
            <Link href="#">Documentation</Link>
          </Stack>
          <Stack spacing={1.5}>
            <Typography fontWeight="bold">COMMUNITY</Typography>
            <Link href="#">Branding</Link>
            <Link href="#">Streamkit</Link>
            <Link href="#">Credits</Link>
            <Link href="#">We ❤️ Developers </Link>
          </Stack>
          <Stack spacing={1.5}>
            <Typography fontWeight="bold">LEGAL</Typography>
            <Link href="#">Terms of Service</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Cookie Settings</Link>
            <Link href="#">EULA</Link>
          </Stack>
        </Stack>
      </Stack>
    </SectionLayout>
  );
};

export default FooterNav;
