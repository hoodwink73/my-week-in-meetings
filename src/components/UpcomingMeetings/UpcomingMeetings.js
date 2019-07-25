import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { FirestoreDataContext } from "../FirestoreData";
import { Flex, Box, Text } from "@rebass/emotion";

import { UserConfigContext } from "../UserConfig";
import { sortEvents, getWorkHours, groupEventsByTime } from "../../utils";
import Events from "../Events";
import { useBeat } from "../../hooks";

export default function UpcomingMeetings() {
  useBeat();

  const { eventsThisWeek: eventsThisWeekRequest } = useContext(
    FirestoreDataContext
  );

  const { userConfig } = useContext(UserConfigContext);

  const eventsThisWeek = eventsThisWeekRequest.data;

  let { happening } = groupEventsByTime(eventsThisWeek);
  happening = sortEvents(happening);

  let upcomingEvents = eventsThisWeek.filter(event => {
    if (
      moment(event.start.dateTime).isAfter(moment(), "minute") &&
      moment(event.start.dateTime).isBefore(
        getWorkHours(false, userConfig).workEndTime,
        "minute"
      )
    ) {
      return true;
    } else {
      return false;
    }
  });

  upcomingEvents = sortEvents(upcomingEvents);

  return (
    <Flex flexDirection="column" my={3}>
      <Text fontSize={[3, 4]} fontWeight="bold" textAlign={["left"]}>
        Today
      </Text>
      <Events
        events={[...happening, ...upcomingEvents]}
        happeningNow={happening.map(({ id }) => id)}
      />
    </Flex>
  );
}
