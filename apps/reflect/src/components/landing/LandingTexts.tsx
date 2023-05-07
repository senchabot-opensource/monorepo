import {
  Box,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import { env } from "../../env/client.mjs";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getDefaultCmdList, getFeatureList } from "../../api";
import { randomInt } from "next/dist/shared/lib/bloom-filter/utils";
import { signIn, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";

const ALT_TEXT = "All Bots and Stream overlays, Manage from one place!";
// Stream overlays: #8b5cf6
const LandingTexts = () => {
  const [cmdList, setCmdList] = useState<string[]>([]);
  const [featureList, setFeatureList] = useState<string[]>([]);
  const { data: session } = useSession();
  const { data: twitchAcc } = trpc.check.checkTwitchAcc.useQuery();
  const commandList = trpc.command.getCommandList.useQuery();

  const twitchBotMutate = trpc.twitchBot.add.useMutation({
    onSuccess() {
      alert("Twitch bot added");
    },

    onError(error) {
      if (!error.shape) return;
      alert(error.shape.message);
    },
  });

  useEffect(() => {
    getDefaultCmdList().then(res => {
      if (!commandList.isLoading && session) {
        const cmds = commandList.data?.map(cmd => "!" + cmd.commandName);
        if (cmds) {
          const tocmds = [...res.defaultCmd, ...cmds];
          setCmdList(tocmds);
        }
      } else {
        setCmdList(res.defaultCmd);
      }
    });

    getFeatureList().then(res => {
      setFeatureList(res.featureList);
    });
  }, [commandList.isLoading]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-end"
      alignItems="center"
      position="relative"
      overflow="hidden"
      sx={{ pt: { xs: "none", md: "1vh" }, userSelect: "none" }}>
      <Box
        position="absolute"
        height="inherit"
        width="inherit"
        top={0}
        zIndex={-1}>
        {cmdList.map((cmd, index) => {
          return (
            <Typography
              key={index}
              position="absolute"
              color={cmd[0] === "!" ? "#6034b2" : "#7289da"}
              top={randomInt(1, 75) + "vh"}
              left={randomInt(1, 90) + "vw"}
              sx={{
                fontFamily: "monospace",
                animation: "move 20s linear infinite",
                textAlign: "center",
                "@keyframes move": {
                  "50%": {
                    opacity: 0.5,
                    top: randomInt(1, 75) + "vh",
                  },
                  "100%": {
                    opacity: 1,
                  },
                },
              }}>
              {cmd}
            </Typography>
          );
        })}
      </Box>
      <Stack
        direction="column"
        textAlign="center"
        width={{ xs: "100vw", sm: "75vw", lg: "37vw" }}>
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontFamily: "monospace",
            fontSize: { xs: "4rem", md: "5rem" },
          }}>
          <span style={{ color: "#6034b2" }}>
            {env.NEXT_PUBLIC_APP_NAME.substring(0, 6)}
          </span>
          <span style={{ color: "#7289da" }}>
            {env.NEXT_PUBLIC_APP_NAME.substring(6, 9).charAt(0).toUpperCase() +
              env.NEXT_PUBLIC_APP_NAME.substring(7, 9)}
          </span>
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Source Code Pro",
            display: { xs: "none", md: "block" },
          }}
          textAlign="center">
          {ALT_TEXT}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontFamily: "Source Code Pro",
            display: { xs: "block", md: "none" },
          }}
          textAlign="center">
          {ALT_TEXT}
        </Typography>
        <Stack
          justifyContent="center"
          direction="row"
          spacing={{ xs: 2, md: 5 }}
          marginTop="5%"
          marginLeft={{ xs: "2.5%" }}
          marginRight={{ xs: "2.5%" }}>
          <Button
            href={`${env.NEXT_PUBLIC_APP_DISCORD_BOT_INVITE_URL}`}
            component={Link}
            variant="contained"
            startIcon={<FaDiscord />}
            sx={{
              backgroundColor: "#7289da",
              "&:hover": {
                backgroundColor: "rgba(114,137,218,0.74)",
              },
            }}>
            Get Discord Bot
          </Button>
          <Button
            onClick={() => {
              if (!session || !twitchAcc) {
                signIn("twitch", {
                  callbackUrl: `${window.location.origin}/api/twitch/get-bot`,
                });
              } else {
                twitchBotMutate.mutate();
              }
            }}
            variant="contained"
            startIcon={<FaTwitch />}
            sx={{
              backgroundColor: "#6034b2",
              "&:hover": {
                backgroundColor: "rgba(96,52,178,0.74)",
              },
            }}>
            Get Twitch Bot
          </Button>
        </Stack>
        <Stack
          bgcolor="rgba(50,50,50,0.3)"
          borderRadius="1px"
          marginTop="5%"
          marginBottom={{ xs: "20%", md: "10%" }}
          marginLeft={{ xs: "2.5%" }}
          marginRight={{ xs: "2.5%" }}
          sx={{
            backdropFilter: "blur(1px)",
          }}>
          {/* TODO: can be edited from the admin panel in the future  */}
          <List>
            {featureList.map((feature, index) => {
              return (
                <ListItem key={index}>
                  <Typography
                    variant="h6"
                    sx={{ fontFamily: "Source Code Pro", color: "#fff" }}>
                    {index + 1}) {feature}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </Stack>
      </Stack>
    </Grid>
  );
};

export default LandingTexts;
