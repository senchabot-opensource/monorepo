import * as React from "react";
import { NextPage } from "next";
import AppContainer from "../../components/app/AppContainer";
import Header from "../../components/common/Header";
import { Paper } from "@mui/material";
import HorizontalTabPanel from "../../components/tabpanel/HorizontalTabPanel";

import { useSession } from "next-auth/react";

import SecurityForm from "../../forms/SecurityForm";
import PrivacyForm from "../../forms/PrivacyForm";
import { atom, useAtom } from "jotai";
import SettingTopTab from "../../components/tab/SettingTopTab";
import BotConfigurationTab from "../../components/tab/BotConfiguration";

export const SettingTopTabAtom = atom<number>(0);

const Settings: NextPage = () => {
  useSession({ required: true });
  const [isLoading, setIsLoading] = React.useState(true);

  const [value] = useAtom(SettingTopTabAtom);

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  return (
    <>
      <Header title="App Settings" index={false} />
      <AppContainer isLoading={isLoading}>
        <Paper
          sx={{ mt: "10px", backgroundColor: "#000", padding: "10px" }}
          elevation={1}>
          <SettingTopTab />
          <HorizontalTabPanel value={value} index={0}>
            <BotConfigurationTab />
          </HorizontalTabPanel>
          <HorizontalTabPanel value={value} index={1}>
            <SecurityForm />
          </HorizontalTabPanel>
          <HorizontalTabPanel value={value} index={2}>
            <PrivacyForm />
          </HorizontalTabPanel>
        </Paper>
      </AppContainer>
    </>
  );
};

export default Settings;
