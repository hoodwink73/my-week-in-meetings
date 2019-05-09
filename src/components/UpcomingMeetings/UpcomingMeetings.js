import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { FirestoreDataContext } from "../FirestoreData";
import { Flex, Box, Text } from "@rebass/emotion";
import Events from "./Events";
import { sortEvents } from "../../utils";

import { useRerender } from "../../hooks";

// a minute
const REFRESH_TIMER_FREQUENCY_IN_MS = 60 * 1000;

export default function UpcomingMeetings() {
  const { eventsThisWeek: eventsThisWeekRequest } = useContext(
    FirestoreDataContext
  );

  // render the component after a certain interval to get the correct time left
  useRerender(REFRESH_TIMER_FREQUENCY_IN_MS);

  const eventsThisWeek = eventsThisWeekRequest.data;

  let upcomingEvents = eventsThisWeek.filter(event => {
    if (
      moment(event.start.dateTime).isAfter(moment()) &&
      moment(event.start.dateTime).isBefore(moment().endOf("day"))
    ) {
      return true;
    } else {
      return false;
    }
  });

  upcomingEvents = sortEvents(upcomingEvents);

  return (
    <Flex flexDirection="column" my={3}>
      <Text fontSize={[3, 4]} fontWeight="bold" textAlign={["left", "center"]}>
        Upcoming Meetings for Today
      </Text>
      <Events events={upcomingEvents} />
    </Flex>
  );
}
