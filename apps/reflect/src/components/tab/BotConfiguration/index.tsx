import { Grid, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import VerticalTabPanel from "../../tabpanel/VerticalTabPanel";
import TwitchBotForm from "src/forms/TwitchBotForm";

const verticalTabPanelProps = (index: number) => {
  return {
    id: `vertical-tabpanel-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const BotConfigurationTab = () => {
  const [vTPValue, setVTPValue] = useState(0);

  const handleVTPChange = (event: React.SyntheticEvent, newValue: number) => {
    setVTPValue(newValue);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={0} sm={0} md={2}>
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
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <VerticalTabPanel value={vTPValue} index={0}>
          <TwitchBotForm />
        </VerticalTabPanel>
      </Grid>
    </Grid>
  );
};

export default BotConfigurationTab;
