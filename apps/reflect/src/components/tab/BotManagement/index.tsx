import { Box, Divider, Tab, Tabs } from "@mui/material";
import React from "react";
import VerticalTabPanel from "../../tabpanel/VerticalTabPanel";
import TwitchBotForm from "src/forms/TwitchBotForm";

function verticalTabPanelProps(index: number) {
  return {
    id: `vertical-tabpanel-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const BotManagementTab = () => {
  const [vTPValue, setVTPValue] = React.useState(0);

  const handleVTPChange = (event: React.SyntheticEvent, newValue: number) => {
    setVTPValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        //height: 224,
      }}>
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
        }}>
        <Tab label="Twitch Bot" {...verticalTabPanelProps(0)} disableRipple />
      </Tabs>

      <VerticalTabPanel value={vTPValue} index={0}>
        <TwitchBotForm />
      </VerticalTabPanel>
    </Box>
  );
};

export default BotManagementTab;
