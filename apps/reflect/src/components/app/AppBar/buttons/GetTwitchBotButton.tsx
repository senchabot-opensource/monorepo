import { IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { SiTwitch } from "react-icons/si";
import { checkTwitchAccount } from "src/api";
import { BootstrapTooltip } from "src/components/Tooltip";

const GetTwitchBotButton = () => {
  const [twitchAcc, setTwitchAcc] = useState("");

  useEffect(() => {
    checkTwitchAccount().then(res => {
      if (!res.data) return;
      console.log(res.data);
      setTwitchAcc(res.data);
    });
  }, []);

  return (
    <BootstrapTooltip title="Get Twitch Bot">
      <Typography
        onClick={() =>
          !twitchAcc
            ? alert(
                "Before you can add the Twitch bot, you need to link your Twitch account in Settings/Security section.",
              )
            : alert("okay")
        }>
        <IconButton
          aria-label="get twitch bot"
          sx={{
            display: "flex",
          }}>
          <SiTwitch />
        </IconButton>
      </Typography>
    </BootstrapTooltip>
  );
};

export default GetTwitchBotButton;
