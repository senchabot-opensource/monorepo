import { Box, Tab, Tabs } from "@mui/material";
import { useAtom } from "jotai";
import React from "react";
import { SettingTopTabAtom } from "../../pages/app/settings";

function horizontalTabPanelProps(index: number) {
  return {
    id: `horizontal-tabpanel-${index}`,
    "aria-controls": `horizontal-tabpanel-${index}`,
  };
}

const SettingTopTab = () => {
  const [value, setValue] = useAtom(SettingTopTabAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="scrollable settings tab"
        textColor="inherit"
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile>
        <Tab
          label="Bot Configuration"
          {...horizontalTabPanelProps(0)}
          disableRipple
        />
        <Tab label="Security" {...horizontalTabPanelProps(1)} disableRipple />
        <Tab label="Privacy" {...horizontalTabPanelProps(2)} disableRipple />
      </Tabs>
    </Box>
  );
};

export default SettingTopTab;
