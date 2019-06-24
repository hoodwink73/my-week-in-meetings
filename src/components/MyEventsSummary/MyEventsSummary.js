import React, { useContext } from "react";
import { Flex, Box, Card, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";
import useTimeout from "react-use/lib/useTimeout";
import delve from "dlv";

import LoadingContainer from "../LoadingContainer";
import Greeting from "../Greeting";
import TimeLeftForWork from "../TimeLeftForWork";
import LogoutLink from "../LogoutLink";
import Tips from "../Tips";
import AnalyticsCard from "../AnalyticsCard";
import UpcomingMeetings from "../UpcomingMeetings";
import UserSettings from "../UserSettings";
import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";

import { useDoesUserHaveAggregatedData } from "../../hooks";
import { FirestoreDataContext } from "../FirestoreData";

export default function MyEventsSummary() {
  const {
    value: aggregatedDataForUser,
    loading
  } = useDoesUserHaveAggregatedData();
  const changeLoaderMessage = useTimeout(2000);

  const isLarge = useMedia("(min-width: 64em)");

  const { aggregatedEvents, eventsThisWeek } = useContext(FirestoreDataContext);

  // when user signs up for the first time
  // they will not have any events and as we fetch events
  // for past four weeks, it might take a bit more time
  // **hence we want a special message along with the loader**
  // but a user may not have any events during the time
  // for which we are fetching the data
  // so the only way to figure out that firebase has fetched
  // the events via calendar API is rely on the fact
  // **we aggregate data for every new user after we fetch the events**
  // so we wait for the signal that data aggregation has been performed for
  // the user
  const hasEventsBeenFetchedForUser =
    loading || (!loading && delve(aggregatedDataForUser, "size", false));

  // our aggregated events data gets resolved in two parts
  // data for this week
  // and then data for rest of the week
  // the element in the loading array represents data loading state for
  // the this week and the next element represents data loading for the
  // last four weeks
  const hasAggregatedEventsLoaded =
    aggregatedEvents.loading.length > 0 &&
    !aggregatedEvents.loading[0] &&
    !aggregatedEvents.loading[1];

  if (!hasEventsBeenFetchedForUser) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        css={css`
          height: 100vh;
        `}
      >
        <Card
          as={Flex}
          width={changeLoaderMessage ? 400 : "auto"}
          borderRadius={10}
          bg={changeLoaderMessage ? "primary.0" : "transparent"}
          p={4}
        >
          <Box width={64} pt={1} mr={2} flex="0 0 auto">
            <LoadingIcon />
          </Box>
          {changeLoaderMessage ? (
            <Text fontSize={2} fontWeight="bold" flex="0 1 auto">
              If you are signing up for the first time, we are getting your
              calendar events. Usually it takes a few seconds.
            </Text>
          ) : null}
        </Card>
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

          <LoadingContainer isLoading={eventsThisWeek.loading}>
            <TimeLeftForWork selectedTimeRange="today" my={4} width={[1]} />

            <UpcomingMeetings />

            <Tips />

            <LoadingContainer isLoading={!hasAggregatedEventsLoaded}>
              <Flex
                justifyContent="space-between"
                flexWrap={["nowrap", "wrap"]}
                paddingLeft={[2, 0]}
                paddingTop={[2, 0]}
                paddingRight={[2, 0]}
                mb={4}
                css={css`
                  overflow-x: ${isLarge ? "unset" : "scroll"};
                  scroll-behavior: smooth;
                  -webkit-overflow-scrolling: touch;
                `}
              >
                <AnalyticsCard type="timeSpentInMeetings" mr={[3, 0]} />
                <AnalyticsCard type="busiestDay" mr={[3, 0]} />
                <AnalyticsCard type="topCollaborator" mt={[0, 3]} mr={[3, 0]} />
                <AnalyticsCard
                  type="meetingsByDomains"
                  mt={[0, 3]}
                  mr={[3, 0]}
                />
                {/*  Hack to prevent box shadow of last card getting clipped on mobile*/}
                <Box p={[1, 0]} />
              </Flex>
            </LoadingContainer>
          </LoadingContainer>
        </Flex>
      </>
    );
  }
}
