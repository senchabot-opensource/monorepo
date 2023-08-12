import { ChangeEvent, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { SiDiscord, SiTwitch } from "react-icons/si";
import { signIn } from "next-auth/react";
import Link from "next/link";
import AuthLoginButton from "./AuthLoginButton";

const AuthContainer = () => {
  const [acceptTos, setAcceptTos] = useState<boolean>(false);
  const theme = useTheme();
  const handleAcceptTos = (e: ChangeEvent<HTMLInputElement>) => {
    setAcceptTos(e.target.checked);
  };

  return (
    <>
      <Stack
        direction="column"
        spacing={2}
        sx={{ p: 2, backgroundColor: "appLoginForm.background" }}>
        <Typography fontSize="x-large">Sign in/up</Typography>
        <AuthLoginButton
          disabled={!acceptTos}
          fullWidth={true}
          onClick={() => {
            if (!acceptTos) return;
            signIn("twitch", {
              callbackUrl: `${window.location.origin}/app`,
            });
          }}
          icon={
            <SiTwitch
              color={acceptTos ? "#815fc0" : "gray"}
              fontSize="x-large"
            />
          }
          content="with Twitch Account"
        />
        <AuthLoginButton
          disabled={!acceptTos}
          fullWidth={true}
          onClick={() => {
            if (!acceptTos) return;

            signIn("discord", {
              callbackUrl: `${window.location.origin}/app`,
            });
          }}
          icon={
            <SiDiscord
              color={acceptTos ? "#7289d9" : "gray"}
              fontSize="x-large"
            />
          }
          content="with Discord Account"
        />
        <FormControlLabel
          sx={{
            alignItems: "flex-start",
          }}
          control={
            <Checkbox
              checked={acceptTos}
              onChange={handleAcceptTos}
              sx={{
                marginTop: -1,
              }}
            />
          }
          label={
            <Typography>
              I agree to{" "}
              <Link
                href="/cookie-policy"
                style={{ color: theme.palette.appLoginForm.policyText }}>
                Cookie Policy
              </Link>
              ,{" "}
              <Link
                href="/privacy-policy"
                style={{ color: theme.palette.appLoginForm.policyText }}>
                Privacy Policy
              </Link>
              ,{" "}
              <Link
                href="/terms"
                style={{ color: theme.palette.appLoginForm.policyText }}>
                Terms of Use
              </Link>
              , and{" "}
              <Link
                href="/eula"
                style={{ color: theme.palette.appLoginForm.policyText }}>
                EULA
              </Link>
            </Typography>
          }
        />
      </Stack>
    </>
  );
};

export default AuthContainer;
