import { IconButton, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { SiTwitch } from "react-icons/si";
import { addTwitchAccount, checkTwitchAccount } from "src/api";
import CustomAlert from "src/components/CustomAlert";
import { BootstrapTooltip } from "src/components/Tooltip";

const GetTwitchBotButton = () => {
  const [twitchAccountAvailable, setTwitchAccountAvailable] =
    useState<boolean>(false);
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");

  useEffect(() => {
    checkTwitchAccount().then(res => {
      setTwitchAccountAvailable(res.data);
    });
  }, []);

  const addTwitchBot = useCallback(() => {
    addTwitchAccount().then(res => {
      if (!res || !res.success) {
        setAlertBox("Something went wrong. Please try again later.");
      }

      if (res.success) {
        setAlertBox(res.message);
      }
    });
  }, []);

  const setAlertBox = (text: string) => {
    setAlertText(text);
    setAlertIsOpen(true);
  };

  return (
    <>
      <CustomAlert
        isOpen={alertIsOpen}
        closeHandler={() => setAlertIsOpen(!alertIsOpen)}
        content={alertText}
      />

      <BootstrapTooltip title="Get Twitch Bot">
        <Typography
          onClick={() => {
            if (!twitchAccountAvailable) {
              setAlertBox(
                "Before you can add the Twitch bot, you need to link your Twitch account in Settings/Security section.",
              );
            } else {
              addTwitchBot();
            }
          }}>
          <IconButton
            aria-label="get twitch bot"
            sx={{
              display: "flex",
            }}>
            <SiTwitch />
          </IconButton>
        </Typography>
      </BootstrapTooltip>
    </>
  );
};

export default GetTwitchBotButton;
