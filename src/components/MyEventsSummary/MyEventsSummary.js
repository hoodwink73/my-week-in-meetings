import React, { useState } from "react";
import { Flex, Box } from "@rebass/emotion";

import {
  getStartOfWeekInUTC,
  filterEventsForToday,
  sortEvents
} from "../../utils";

import Greeting from "../Greeting";
import SelectTimeRange from "../SelectTimeRange";
import TimeLeftForWork from "../TimeLeftForWork";
import LogoutLink from "../LogoutLink";
import Tips from "../Tips";
import AnalyticsCard from "../AnalyticsCard";

export default function MyEventsSummary() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const handleTimeRangeToggle = selectedTabIndex => {
    if (selectedTabIndex === 0) {
      setSelectedTimeRange("today");
    } else if (selectedTabIndex === 1) {
      setSelectedTimeRange("week");
    }
  };

  return (
    <>
      <Flex width="100%" bg="gray.0" flexDirection="column">
        <LogoutLink alignSelf="flex-end" mt={2} mr={4} />
        <Box width={[1, 600]} px={[4, 0]} py={4} alignSelf="center">
          <Greeting my={3} />
          <SelectTimeRange handleTimeRangeToggle={handleTimeRangeToggle} my={3}>
            <TimeLeftForWork
              selectedTimeRange={selectedTimeRange}
              my={3}
              width={256}
            />
          </SelectTimeRange>
        </Box>
      </Flex>
      <Flex justifyContent="center">
        <Box m={4}>
          <Tips
            title="Do you say no to meetings if they are not important?"
            details={["Saying no to meetings might be challenging"]}
          />
        </Box>
      </Flex>
      <Flex justifyContent="center">
        <Box mx={4} my={2}>
          <AnalyticsCard type="timeSpentInMeetings" />
          <AnalyticsCard type="busiestDay" mt={4} />
          <AnalyticsCard type="topOrganizer" mt={4} />
          <AnalyticsCard type="meetingsByDomains" mt={4} />
        </Box>
      </Flex>
    </>
  );
}
