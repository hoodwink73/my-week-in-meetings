import React from "react";
import { Flex, Text } from "@rebass/emotion";
import { EVENT_STATUSES } from "../../constants";

const numAttendeeForEventStatus = (event, status) =>
  event.attendees && event.attendees.length > 0
    ? event.attendees.filter(attendee => attendee.responseStatus === status)
        .length
    : 0;

export default function getAttendeeStatusForEvent({ event }) {
  const AttendeeStatus = [];
  for (let [key, value] of EVENT_STATUSES) {
    const attendeeCountForStatus = numAttendeeForEventStatus(event, value);
    if (attendeeCountForStatus) {
      AttendeeStatus.push(
        <Text
          key={key}
          fontSize={1}
          mr={2}
          color="gray.3"
        >{`${attendeeCountForStatus} ${key}`}</Text>
      );
    }
  }

  return <Flex>{AttendeeStatus}</Flex>;
}
