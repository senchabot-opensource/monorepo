import {
  Box,
  Button,
  Grid,
  Link,
  List,
  ListItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { env } from "../../env/client.mjs";
import { FaDiscord, FaTwitch } from "react-icons/fa";
import { useCallback, useEffect, useState } from "react";
import {
  addTwitchAccount,
  checkTwitchAccount,
  getCommandList,
  getDefaultCmdList,
  getFeatureList,
} from "../../api";
import { randomInt } from "next/dist/shared/lib/bloom-filter/utils";
import { signIn, useSession } from "next-auth/react";
import CustomAlert from "../CustomAlert";
import { IBotCommand } from "src/types";
import { useQuery } from "@tanstack/react-query";

const ALT_TEXT =
  "Open-source multi-platform bot development project, which works on Twitch and Discord.";
// Stream overlays: #8b5cf6
const LandingTexts = () => {
  const { data: session } = useSession();
  const theme = useTheme();

  const [cmdList, setCmdList] = useState<string[]>([]);
  const [defaultCmdList, setDefaultCmdList] = useState<string[]>([]);
  const [userCmdList, setUserCmdList] = useState<string[]>([]);
  const [featureList, setFeatureList] = useState<string[]>([]);
  const [alertIsOpen, setAlertIsOpen] = useState<boolean>(false);
  const [alertText, setAlertText] = useState<string>("");

  useQuery({
    queryKey: ["userCmdList"],
    queryFn: async () => {
      const res = await getCommandList();
      const cmds = res.data.map((cmd: IBotCommand) => "!" + cmd.commandName);
      setUserCmdList(cmds);
      return res;
    },
  });

  const isTwitchAccAvailable = useQuery({
    queryKey: ["isTwitchAccAvaiable"],
    queryFn: () => {
      return checkTwitchAccount();
    },
  });

  useQuery({
    queryKey: ["defaultCmdList"],
    queryFn: async () => {
      const res = await getDefaultCmdList();
      setDefaultCmdList(res.defaultCmd);
    },
  });

  useQuery({
    queryKey: ["featureList"],
    queryFn: async () => {
      const res = await getFeatureList();
      setFeatureList(res.featureList);
    },
  });

  useEffect(() => {
    if (session) {
      const tocmds = [...defaultCmdList, ...userCmdList];
      setCmdList(tocmds);
    } else {
      setCmdList(defaultCmdList);
    }
  }, [session, defaultCmdList, userCmdList]);

  const addTwitchBotOrAccount = () => {
    addTwitchAccount().then(res => {
      if (!res || !res.success) {
        setAlertText("Something went wrong. Please try again later.");
        setAlertIsOpen(true);
      }

      if (res.success) {
        setAlertText(res.message);
        setAlertIsOpen(true);
      }
    });
  };

  return (
    <>
      <CustomAlert
        isOpen={alertIsOpen}
        closeHandler={() => setAlertIsOpen(!alertIsOpen)}
        content={alertText}
      />
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
                color={
                  cmd[0] === "!" ? "landingCmd.primary" : "landingCmd.secondary"
                }
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
            <span style={{ color: theme.palette.landingTitle.primary }}>
              {env.NEXT_PUBLIC_APP_NAME.substring(0, 6)}
            </span>
            <span style={{ color: theme.palette.landingTitle.secondary }}>
              {env.NEXT_PUBLIC_APP_NAME.substring(6, 9)
                .charAt(0)
                .toUpperCase() + env.NEXT_PUBLIC_APP_NAME.substring(7, 9)}
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
                backgroundColor: "landingDiscordBtn.background",
                "&:hover": {
                  backgroundColor: "landingDiscordBtn.backgroundHover",
                },
              }}>
              Get Discord Bot
            </Button>
            <Button
              onClick={() => {
                if (!session || !isTwitchAccAvailable.data?.data) {
                  signIn("twitch", {
                    callbackUrl: `${window.location.origin}/api/twitch/get-bot`,
                  });
                } else {
                  addTwitchBotOrAccount();
                }
              }}
              variant="contained"
              startIcon={<FaTwitch />}
              sx={{
                backgroundColor: "landingTwitchBtn.background",
                "&:hover": {
                  backgroundColor: "landingTwitchBtn.backgroundHover",
                },
              }}>
              Get Twitch Bot
            </Button>
          </Stack>
          <Stack
            bgcolor="landingTextBackground"
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
                      sx={{
                        fontFamily: "Source Code Pro",
                      }}>
                      {index + 1}) {feature}
                    </Typography>
                  </ListItem>
                );
              })}
            </List>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
};

export default LandingTexts;
