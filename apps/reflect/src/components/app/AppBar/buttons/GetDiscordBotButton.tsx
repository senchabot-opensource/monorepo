import { IconButton, Typography } from "@mui/material";
import { SiDiscord } from "react-icons/si";
import { BootstrapTooltip } from "src/components/Tooltip";
import { signIn } from "next-auth/react";

const GetDiscordBotButton = () => {
  return (
    <BootstrapTooltip title="Get Discord bot">
      <Typography
        onClick={() => {
          signIn("discord");
        }}>
        <IconButton
          aria-label="get discord bot"
          sx={{
            display: "flex",
          }}>
          <SiDiscord />
        </IconButton>
      </Typography>
    </BootstrapTooltip>
  );
};

export default GetDiscordBotButton;
