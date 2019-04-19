import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box } from "@rebass/emotion";

import { EventsContext } from "../MyEventsSummary";
import Time from "../Time";
import Progress from "../Progress";

import {
  filterEventsForToday,
  timeLeftForWorkInMs,
  getWorkHours
} from "../../utils";

const REFRESH_TIMER_FREQUENCY_IN_MS = 60 * 1000;

export default function TimeLeftForWork({ selectedTimeRange }) {
  const eventsForThisWeek = useContext(EventsContext);

  const [renderCounter, setRenderCounter] = useState(0);

  useEffect(() => {
    const unsubscribeID = setInterval(() => {
      setRenderCounter(renderCounter + 1);
    }, REFRESH_TIMER_FREQUENCY_IN_MS);

    return () => clearInterval(unsubscribeID);
  });

  let eventsForToday = [];
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

  if (eventsForThisWeek.length > 0) {
    eventsForToday = filterEventsForToday(eventsForThisWeek);
  }

  const { workStartTime, workEndTime } = getWorkHours(showDataForWeek);

  if (showDataForWeek) {
    events = eventsForThisWeek;
  } else {
    events = eventsForToday;
  }

  // this is excluding the total meeting time
  const totalTimeAvailableForWorkFromStartTime = timeLeftForWorkInMs(events, {
    workStartTime,
    workEndTime,
    fromTime: workStartTime
  });

  // from right now, how much time I have left for work
  // this is excluding the meetings I have to take in the recent future
  // until my workday ends
  const timeLeftFromThisInstant = timeLeftForWorkInMs(events, {
    workStartTime,
    workEndTime
  });

  const timeElapsedDoingWorkInPercentage =
    totalTimeAvailableForWorkFromStartTime === 0
      ? 100
      : ((totalTimeAvailableForWorkFromStartTime - timeLeftFromThisInstant) /
          totalTimeAvailableForWorkFromStartTime) *
        100;

  return (
    <Box width={256}>
      <Time timeInMs={timeLeftFromThisInstant} />
      <Progress width={1} percent={timeElapsedDoingWorkInPercentage} />
    </Box>
  );
}

TimeLeftForWork.propTypes = {
  selectedTimeRange: PropTypes.oneOf(["today", "week"])
};
