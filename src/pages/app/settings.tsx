import * as React from "react";
import { NextPage } from "next";
import AppContainer from "../../components/app/AppContainer";
import AppHeader from "../../components/app/AppHeader";
import { Paper } from "@mui/material";
import HorizontalTabPanel from "../../components/tabpanel/HorizontalTabPanel";

import { useSession } from "next-auth/react";

import { SnackbarOrigin } from "@mui/material/Snackbar";
import SecurityForm from "../../forms/SecurityForm";
import PrivacyForm from "../../forms/PrivacyForm";
import { atom, useAtom } from "jotai";
import SettingTopTab from "../../components/tab/SettingTopTab";
import DisplayTab from "../../components/tab/Display";

export const SettingTopTabAtom = atom<number>(0);

const Settings: NextPage = () => {
  useSession({ required: true });
  const [isLoading, setIsLoading] = React.useState(true);

  const [value] = useAtom(SettingTopTabAtom);

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const [snackbarState, setSnackbarState] = React.useState<SnackbarOrigin>({
    vertical: "bottom",
    horizontal: "left",
  });

  const [snackbarOpen, setSnackBarOpen] = React.useState(false);

  const handleSnackbarClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  return (
    <>
      <AppHeader title="App Settings" index={false} />
      <AppContainer isLoading={isLoading}>
        <Paper
          sx={{ mt: "10px", backgroundColor: "#000", padding: "10px" }}
          elevation={1}
        >
          <SettingTopTab />
          <HorizontalTabPanel value={value} index={0}>
            <DisplayTab />
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
