import React from "react";

import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";

export default function SelectTimeTange({ handleTimeRangeToggle, children }) {
  return (
    <Tabs onChange={handleTimeRangeToggle}>
      <TabList>
        <Tab>Today</Tab>
        <Tab>This Week </Tab>
      </TabList>

      {children}
    </Tabs>
  );
}
