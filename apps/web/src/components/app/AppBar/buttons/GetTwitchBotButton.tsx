import { IconButton, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiTwitch } from "react-icons/si";
import { addTwitchAccount, checkTwitchAccount } from "src/api";
import CustomAlert from "src/components/CustomAlert";
import { BootstrapTooltip } from "src/components/Tooltip";

const GetTwitchBotButton = () => {
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");

  const isTwitchAccAvailable = useQuery({
    queryKey: ["isTwitchAccAvaiable"],
    queryFn: () => {
      return checkTwitchAccount();
    },
  });

  const addTwitchBot = useMutation({
    mutationFn: async () => {
      const res = await addTwitchAccount();
      if (!res.success) {
        setAlertBox("Something went wrong. Please try again later.");
      }
      setAlertBox(res.message);

      return res.success;
    },
  });

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
            if (!isTwitchAccAvailable.data?.data) {
              setAlertBox(
                "Before you can add the Twitch bot, you need to link your Twitch account in Settings/Security section.",
              );
            }
            addTwitchBot.mutate();
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
