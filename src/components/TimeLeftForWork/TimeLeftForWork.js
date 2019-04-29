import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@rebass/emotion";

import { FirestoreDataContext } from "../FirestoreData";
import { UserConfigContext } from "../UserConfig";
import Time from "../Time";
import Progress from "../Progress";
import {
  filterEventsForToday,
  timeLeftForWorkInMs,
  getWorkHours
} from "../../utils";

const REFRESH_TIMER_FREQUENCY_IN_MS = 60 * 1000;

export default function TimeLeftForWork({ selectedTimeRange, ...props }) {
  const { eventsThisWeek: eventsThisWeekRequest } = useContext(
    FirestoreDataContext
  );

  const { userConfig } = useContext(UserConfigContext);

  const eventsThisWeek = eventsThisWeekRequest.data;

  const [renderCounter, setRenderCounter] = useState(0);

  useEffect(() => {
    const unsubscribeID = setInterval(() => {
      setRenderCounter(renderCounter + 1);
    }, REFRESH_TIMER_FREQUENCY_IN_MS);

    return () => clearInterval(unsubscribeID);
  });

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

  return (
    <Box {...props}>
      <Text fontSize={2} mb={1}>
        You have
      </Text>
      <Time timeInMs={timeLeftFromThisInstant} />
      <Progress width={1} percent={timeElapsedDoingWorkInPercentage} />
      <Text fontSize={2} mt={3}>
        avaialable for work{" "}
        {selectedTimeRange === "week"
          ? `this ${selectedTimeRange}`
          : selectedTimeRange}
      </Text>
    </Box>
  );
}

TimeLeftForWork.propTypes = {
  selectedTimeRange: PropTypes.oneOf(["today", "week"]),
  ...Box.propTypes
};
