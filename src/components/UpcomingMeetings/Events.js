import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
import moment from "moment";
import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Events({ events }) {
  const { user } = useAuthState(firebase.auth());

  const dateFormatString = "kk : mm";

  const formatDateTime = dateTimeString =>
    moment(dateTimeString).format(dateFormatString);

  const EVENT_STATUSES = new Map([
    ["Accepted", "accepted"],
    ["Maybe", "tentative"],
    ["Declined", "declined"],
    ["Not Responded", "needsAction"]
  ]);

  const numAttendeeForEventStatus = (event, status) =>
    event.attendees.length > 0
      ? event.attendees.filter(attendee => attendee.responseStatus === status)
          .length
      : 0;

  const getAttendeeStatusForEvent = event => {
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
  };

  return (
    <Flex flexDirection="column" py={4}>
      {events.length < 1 ? (
        <Text textAlign="center" color="gray.3">
          No upcoming meetings today
        </Text>
      ) : (
        events.map(event => (
          <Flex
            key={event.id}
            justifyContent="space-between"
            flexWrap={["wrap", "nowrap"]}
            mb={[4, 0]}
          >
            <Text
              width={[1, 1 / 4]}
              alignSelf="center"
              fontWeight="bold"
              order={[1, 2]}
            >
              {formatDateTime(event.start.dateTime)} -{" "}
              {formatDateTime(event.end.dateTime)}{" "}
            </Text>
            <Box
              width={[1, 3 / 4]}
              p={[0, 3]}
              alignSelf="center"
              order={[2, 1]}
            >
              <Text fontSize={3} fontWeight="bold" mb={1}>
                {event.summary}
              </Text>
              <Text fontSize={2} color="gray.3" mb={1}>
                Organised by{" "}
                {event.organizer.email === user.email
                  ? "you"
                  : event.organizer.email}
              </Text>
              {getAttendeeStatusForEvent(event)}
            </Box>
          </Flex>
        ))
      )}
    </Flex>
  );
}

Event.propType = {
  event: PropTypes.arrayOf(PropTypes.object).isRequired
};
