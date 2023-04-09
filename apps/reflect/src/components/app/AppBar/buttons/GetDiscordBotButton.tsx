import { IconButton, Typography } from "@mui/material";
import Link from "next/link";
import { SiDiscord } from "react-icons/si";
import { BootstrapTooltip } from "src/components/Tooltip";
import { env } from "../../../../env/client.mjs";

const GetDiscordBotButton = () => {
  return (
    <BootstrapTooltip title="Get Discord bot">
      <Typography>
        <Link href={`${env.NEXT_PUBLIC_APP_DISCORD_BOT_INVITE_URL}`} passHref>
          <IconButton
            aria-label="get discord bot"
            sx={{
              display: "flex",
            }}>
            <SiDiscord />
          </IconButton>
        </Link>
      </Typography>
    </BootstrapTooltip>
  );
};

export default GetDiscordBotButton;
