import React, { useState, useContext } from "react";
import { Flex, Box } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

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
import UpcomingMeetings from "../UpcomingMeetings";
import UserSettings from "../UserSettings";
import { UserConfigContext } from "../UserConfig";
import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";

export default function MyEventsSummary() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const { userConfigRequest } = useContext(UserConfigContext);

  const handleTimeRangeToggle = selectedTabIndex => {
    if (selectedTabIndex === 0) {
      setSelectedTimeRange("today");
    } else if (selectedTabIndex === 1) {
      setSelectedTimeRange("week");
    }
  };

  if (userConfigRequest.loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        css={css`
          height: 100vh;
        `}
      >
        <Box width={64} pt={1} mr={2}>
          <LoadingIcon />
        </Box>
      </Flex>
    );
  } else {
    return (
      <>
        <Flex width={[1, 600]} px={[4, 0]} m="auto" flexDirection="column">
          <Box py={2} />
          <Flex>
            <Greeting my={1} />
            <UserSettings ml="auto" mr={2} alignSelf="center" />
            <LogoutLink alignSelf="center" />
          </Flex>
          {/* <SelectTimeRange handleTimeRangeToggle={handleTimeRangeToggle} my={3}>
            </SelectTimeRange> */}
          <TimeLeftForWork
            selectedTimeRange={selectedTimeRange}
            my={4}
            width={[1]}
          />
          <UpcomingMeetings />

          <Tips />
          <Flex justifyContent="space-between" flexWrap="wrap">
            <AnalyticsCard type="timeSpentInMeetings" />
            <AnalyticsCard type="busiestDay" />
            <AnalyticsCard type="topOrganizer" mt={[0, 3]} />
            <AnalyticsCard type="meetingsByDomains" mt={[0, 3]} />
          </Flex>
        </Flex>
        {/* <Flex justifyContent="center">
          <Box m={4}>
            <Tips
              title="Do you say no to meetings if they are not important?"
              details={["Saying no to meetings might be challenging"]}
            />
          </Box>
        </Flex> */}
      </>
    );
  }
}
