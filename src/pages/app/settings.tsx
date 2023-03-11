import * as React from "react";
import { NextPage } from "next";
import AppContainer from "../../components/app/AppContainer";
import AppHeader from "../../components/app/AppHeader";
import {
  Paper,
  Box,
  Tabs,
  Tab,
  //Grid,
  Divider,
  TextField,
  //Tooltip,
  //Button,
} from "@mui/material";
import HorizontalTabPanel from "../../components/tabpanel/HorizontalTabPanel";
import VerticalTabPanel from "../../components/tabpanel/VerticalTabPanel";
//import { trpc } from "../../utils/trpc";
//import { blueGrey } from "@mui/material/colors";
//import { Controller, useForm } from "react-hook-form";
//import { zodResolver } from "@hookform/resolvers/zod";
import TwitchDisplayForm from "../../forms/TwitchDisplayForm";
import SenchaDisplayForm from "../../forms/SenchaDisplayForm";
import { useSession } from "next-auth/react";

import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import SecurityForm from "../../forms/SecurityForm";
import PrivacyForm from "../../forms/PrivacyForm";

/*export interface SnackbarState extends SnackbarOrigin {
  open: boolean;
}*/

function horizontalTabPanelProps(index: number) {
  return {
    id: `horizontal-tabpanel-${index}`,
    "aria-controls": `horizontal-tabpanel-${index}`,
  };
}

function verticalTabPanelProps(index: number) {
  return {
    id: `vertical-tabpanel-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Settings: NextPage = () => {
  useSession({ required: true });
  const [isLoading, setIsLoading] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const [vTPValue, setVTPValue] = React.useState(0);

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleVTPChange = (event: React.SyntheticEvent, newValue: number) => {
    setVTPValue(newValue);
  };

  const [snackbarState, setSnackbarState] = React.useState<SnackbarOrigin>({
    vertical: "bottom",
    horizontal: "left",
  });

  const [snackbarOpen, setSnackBarOpen] = React.useState(false);

  //const { vertical, horizontal } = snackbarState;

  /*const handleSnackBarOpen =  () => {
    setSnackbarState(true);
  };*/

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
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="scrollable settings tab"
              textColor="inherit"
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
            >
              <Tab
                label="Display"
                {...horizontalTabPanelProps(0)}
                disableRipple
              />
              <Tab
                label="Security"
                {...horizontalTabPanelProps(1)}
                disableRipple
              />
              <Tab
                label="Privacy"
                {...horizontalTabPanelProps(2)}
                disableRipple
              />
            </Tabs>
          </Box>
          <HorizontalTabPanel value={value} index={0}>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                //height: 224,
              }}
            >
              <Tabs
                orientation="vertical"
                variant="scrollable"
                value={vTPValue}
                onChange={handleVTPChange}
                aria-label="Vertical tab"
                textColor="inherit"
                sx={{
                  borderRight: 1,
                  borderColor: "divider",
                  display: { xs: "none", md: "flex" },
                }}
              >
                <Tab
                  label="Twitch UI"
                  {...verticalTabPanelProps(0)}
                  disableRipple
                />
                <Tab
                  label="Sencha UI"
                  {...verticalTabPanelProps(1)}
                  disableRipple
                />
              </Tabs>

              <VerticalTabPanel value={vTPValue} index={0}>
                <TwitchDisplayForm />
                <Box component="div" sx={{ display: { md: "none" } }}>
                  <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{ mt: 2, mb: 2, width: "100%" }}
                  />
                  <SenchaDisplayForm />
                </Box>
              </VerticalTabPanel>

              <VerticalTabPanel value={vTPValue} index={1}>
                <SenchaDisplayForm />
              </VerticalTabPanel>
            </Box>
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
