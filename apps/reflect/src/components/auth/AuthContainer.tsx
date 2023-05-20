import {
  Alert,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { SiDiscord, SiTwitch } from "react-icons/si";
import { signIn } from "next-auth/react";
import Link from "next/link";
import AuthLoginButton from "./AuthLoginButton";
import { ChangeEvent, useState } from "react";

const AuthContainer = () => {
  const [acceptTos, setAcceptTos] = useState(false);
  const [showNotAcceptedWarning, setShowNotAcceptedWarning] = useState(false);

  const handleAcceptTos = (e: ChangeEvent<HTMLInputElement>) => {
    setAcceptTos(e.target.checked);
  };

  const handleWarningClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setShowNotAcceptedWarning(false);
  };

  return (
    <>
      <Snackbar
        open={showNotAcceptedWarning}
        autoHideDuration={6000}
        onClose={handleWarningClose}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}>
        <Alert
          variant="filled"
          onClose={handleWarningClose}
          severity="error"
          sx={{ width: "100%" }}>
          You must accept policies first!
        </Alert>
      </Snackbar>

      <Stack
        direction="column"
        spacing={2}
        sx={{ p: 2, backgroundColor: "#000" }}>
        <Typography fontSize="x-large">Sign in/up</Typography>
        <AuthLoginButton
          fullWidth={true}
          onClick={() => {
            if (!acceptTos) {
              setShowNotAcceptedWarning(true);
              return;
            }
            signIn("twitch", {
              callbackUrl: `${window.location.origin}/app`,
            });
          }}
          icon={<SiTwitch color="#815fc0" fontSize="x-large" />}
          content="with Twitch Account"
        />
        <AuthLoginButton
          fullWidth={true}
          onClick={() => {
            if (!acceptTos) {
              setShowNotAcceptedWarning(true);
              return;
            }
            signIn("discord", {
              callbackUrl: `${window.location.origin}/app`,
            });
          }}
          icon={<SiDiscord color="#7289d9" fontSize="x-large" />}
          content="with Discord Account"
        />
        <FormControlLabel
          control={<Checkbox checked={acceptTos} onChange={handleAcceptTos} />}
          label={
            <Typography>
              I agree to{" "}
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
          }
        />
      </Stack>
    </>
  );
};

export default AuthContainer;
