import {
  ListItem,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Grid,
} from "@mui/material";
import { SiDiscord, SiTwitch } from "react-icons/si";
import { signIn } from "next-auth/react";
import { FC, ReactNode, useEffect, useState } from "react";
import { getAccount } from "src/api";

type IProps = {
  accountType: "discord" | "twitch";
  accountTitle: "Discord Account" | "Twitch Account";
  icon: ReactNode;
};

const LinkAccount: FC<IProps> = ({ accountType, accountTitle, icon }) => {
  const [accounts, setAccounts] = useState<any>([]);

  useEffect(() => {
    getAccount().then(res => {
      setAccounts(res.data);
    });
  }, []);

  const currentProviders = accounts.data?.map(
    (account: any) => account.provider,
  );

  return (
    <>
      <ListItem
        button
        disabled={currentProviders?.includes(accountType)}
        onClick={() => signIn(accountType)}
        sx={{ "&:hover": { borderRadius: 1 } }}>
        <ListItemAvatar>
          <Avatar>{icon}</Avatar>
        </ListItemAvatar>
        <ListItemText primary={`with ${accountTitle}`} />
      </ListItem>
    </>
  );
};

const LinkAccountStack = () => {
  return (
    <Grid container direction={{ xs: "column", md: "row" }} spacing={2}>
      <Grid item xs={12} md={4}>
        <LinkAccount
          accountType="discord"
          accountTitle="Discord Account"
          icon={<SiDiscord />}
        />
      </Grid>

      <Grid item xs={12} md={4}>
        <LinkAccount
          accountType="twitch"
          accountTitle="Twitch Account"
          icon={<SiTwitch />}
        />
      </Grid>
    </Grid>
  );
};

export default LinkAccountStack;
