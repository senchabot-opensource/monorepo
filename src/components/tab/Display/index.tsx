import { Box, Divider, Tab, Tabs } from "@mui/material";
import React from "react";
import SenchaDisplayForm from "../../../forms/SenchaDisplayForm";
import TwitchDisplayForm from "../../../forms/TwitchDisplayForm";
import VerticalTabPanel from "../../tabpanel/VerticalTabPanel";

function verticalTabPanelProps(index: number) {
  return {
    id: `vertical-tabpanel-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const DisplayTab = () => {
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
        <Tab label="Twitch UI" {...verticalTabPanelProps(0)} disableRipple />
        <Tab label="Sencha UI" {...verticalTabPanelProps(1)} disableRipple />
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
  );
};

export default DisplayTab;
