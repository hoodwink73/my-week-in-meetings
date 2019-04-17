import React, { useContext, useEffect } from "react";
import { Box } from "@rebass/emotion";

import { EventsContext } from "../MyEventsSummary";
import Time from "../Time";
import Progress from "../Progress";

import {
  filterEventsForToday,
  timeLeftForWorkTodayInMs,
  getWorkHours
} from "../../utils";

export default function TimeLeftForWork() {
  const eventsForThisWeek = useContext(EventsContext);
  let eventsForToday = [];

  if (eventsForThisWeek.length > 0) {
    eventsForToday = filterEventsForToday(eventsForThisWeek);
  }

  const { workStartTime } = getWorkHours();

  // this is excluding the total meeting time
  const totalTimeAvailableForWork = timeLeftForWorkTodayInMs(
    eventsForToday,
    workStartTime
  );
  const timeLeftFromThisInstant = timeLeftForWorkTodayInMs(eventsForToday);

  return (
    <Box width={256}>
      <Time timeInMs={timeLeftFromThisInstant} />
      <Progress
        width={1}
        percent={(timeLeftFromThisInstant / totalTimeAvailableForWork) * 100}
      />
    </Box>
  );
}
