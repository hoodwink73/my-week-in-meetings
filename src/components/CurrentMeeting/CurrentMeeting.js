import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { FirestoreDataContext } from "../FirestoreData";
import { Flex, Box, Text } from "@rebass/emotion";

import { UserConfigContext } from "../UserConfig";
import { sortEvents, getWorkHours, groupEventsByTime } from "../../utils";
import Events from "../Events";

export default function CurrentMeeting() {
  const { eventsThisWeek: eventsThisWeekRequest } = useContext(
    FirestoreDataContext
  );

  const { userConfig } = useContext(UserConfigContext);

  // render the component after a certain interval to get the updated data
  useRerender(REFRESH_TIMER_FREQUENCY_IN_MS);

  const eventsThisWeek = eventsThisWeekRequest.data;

  let { happening } = groupEventsByTime(eventsThisWeek);

  happening = sortEvents(happening);

  return happening.length > 0 ? (
    <Flex flexDirection="column" my={3}>
      <Text fontSize={[3, 4]} fontWeight="bold" textAlign={["left", "center"]}>
        Current Meeting
      </Text>
      <Events events={happening} />
    </Flex>
  ) : null;
}
