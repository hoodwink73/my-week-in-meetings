import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { FirestoreDataContext } from "../FirestoreData";

import { UserConfigContext } from "../UserConfig";
import Time from "../Time";
import Progress from "../Progress";
import {
  filterEventsForToday,
  timeLeftForWorkInMs,
  getWorkHours,
  getDayStatus,
  pluralize
} from "../../utils";
import { useRerender } from "../../hooks";
import { DAY_STATUSES } from "../../constants";

// a minute
const REFRESH_TIMER_FREQUENCY_IN_MS = 60 * 1000;

const IN_PROGRESS_TEXT_OPTIONS = [];

export default function TimeLeftForWork({ selectedTimeRange, ...props }) {
  const { eventsThisWeek: eventsThisWeekRequest } = useContext(
    FirestoreDataContext
  );

  const { userConfig } = useContext(UserConfigContext);

  // render the component after a certain interval to get the correct time left
  useRerender(REFRESH_TIMER_FREQUENCY_IN_MS);

  const eventsThisWeek = eventsThisWeekRequest.data;

  if (eventsThisWeekRequest.loading) {
    return "Loading";
  }

  if (eventsThisWeekRequest.error) {
    console.error(eventsThisWeek.error);
    return null;
  }

  let eventsForToday = filterEventsForToday(eventsThisWeek);
  let events;
  let showDataForWeek;

  switch (selectedTimeRange) {
    case "week":
      showDataForWeek = true;
      break;
    case "today":
    case "default":
      showDataForWeek = false;
  }

  const { workStartTime, workEndTime } = getWorkHours(showDataForWeek, {
    ...userConfig
  });

  if (showDataForWeek) {
    events = eventsThisWeek;
  } else {
    events = eventsForToday;
  }

  // this is excluding the total meeting time
  const totalTimeAvailableForWorkFromStartTime = timeLeftForWorkInMs(
    events,
    {
      workStartTime,
      workEndTime,
      fromTime: workStartTime
    },
    userConfig
  );

  // from right now, how much time I have left for work
  // this is excluding the meetings I have to take in the recent future
  // until my workday ends
  const timeLeftFromThisInstant = timeLeftForWorkInMs(
    events,
    {
      workStartTime,
      workEndTime
    },
    userConfig
  );

  const timeElapsedDoingWorkInPercentage =
    totalTimeAvailableForWorkFromStartTime === 0
      ? 100
      : ((totalTimeAvailableForWorkFromStartTime - timeLeftFromThisInstant) /
          totalTimeAvailableForWorkFromStartTime) *
        100;

  let Content;
  const textProps = {
    fontSize: [1, 4],
    color: "primary.7",
    fontWeight: "bold",
    textAlign: "center"
  };

  switch (getDayStatus(userConfig)) {
    case DAY_STATUSES.get("NO_WORK_TODAY"):
      Content = () => <Text {...textProps}>Its a spa day today!</Text>;
      break;
    case DAY_STATUSES.get("YET_TO_BEGIN"):
      Content = () => (
        <Text
          {...textProps}
        >{pluralize`Namaste! Today is going to be fabulous.`}</Text>
      );
      break;
    case DAY_STATUSES.get("ENDED"):
      Content = () => (
        <Text {...textProps}>Take rest. You did well today.</Text>
      );
      break;
    case DAY_STATUSES.get("IN_PROGRESS"):
    default:
      Content = () => (
        <Text {...textProps}>
          <Time timeInMs={timeLeftFromThisInstant} as="span" />
          <span> left today to get work done</span>
        </Text>
      );
  }

  return (
    <Box
      bg="primary.0"
      px={2}
      py={3}
      css={css`
        border-radius: 25px;
      `}
      {...props}
    >
      <Flex justifyContent="center" alignItems={["center", "flex-start"]}>
        <Progress
          percent={timeElapsedDoingWorkInPercentage}
          width={[16, 32]}
          mt={[1, 0]}
          mr={[2, 3]}
        />
        <Content />
      </Flex>
    </Box>
  );
}

TimeLeftForWork.propTypes = {
  selectedTimeRange: PropTypes.oneOf(["today", "week"]),
  ...Box.propTypes
};
