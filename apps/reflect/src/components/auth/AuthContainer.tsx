import { Stack, Typography } from "@mui/material";
import { SiDiscord, SiTwitch } from "react-icons/si";
import { signIn } from "next-auth/react";
import Link from "next/link";
import AuthLoginButton from "./AuthLoginButton";

const AuthContainer = () => {
  return (
    <Stack
      direction="column"
      spacing={2}
      sx={{ p: 2, backgroundColor: "#000" }}>
      <Typography fontSize="x-large">Sign in/up</Typography>
      <AuthLoginButton
        fullWidth={true}
        onClick={() =>
          signIn("twitch", {
            callbackUrl: `${window.location.origin}/app`,
          })
        }
        icon={<SiTwitch color="#815fc0" fontSize="x-large" />}
        content="with Twitch Account"
      />
      <AuthLoginButton
        fullWidth={true}
        onClick={() =>
          signIn("discord", {
            callbackUrl: `${window.location.origin}/app`,
          })
        }
        icon={<SiDiscord color="#7289d9" fontSize="x-large" />}
        content="with Discord Account"
      />
      <Typography>
        By continuing you agree to{" "}
        <Link href="/cookie-policy" style={{ color: "#ffff00" }}>
          Cookie Policy
        </Link>
        ,{" "}
        <Link href="/privacy-policy" style={{ color: "#ffff00" }}>
          Privacy Policy
        </Link>
        ,{" "}
        <Link href="/terms" style={{ color: "#ffff00" }}>
          Terms of Use
        </Link>
        , and{" "}
        <Link href="/eula" style={{ color: "#ffff00" }}>
          EULA
        </Link>
      </Typography>
    </Stack>
  );
};

export default AuthContainer
