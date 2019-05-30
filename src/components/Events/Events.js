import React from "react";
import PropTypes from "prop-types";
import { Flex, Text } from "@rebass/emotion";

import Event from "./Event";
export default function Events({ events, happeningNow }) {
  return (
    <Flex flexDirection="column" py={4}>
      {events.length < 1 ? (
        <Text textAlign="center" color="gray.3">
          No upcoming meetings today
        </Text>
      ) : (
        events.map(event => (
          <Event
            data={event}
            isHappeningNow={happeningNow.includes(event.id)}
          />
        ))
      )}
    </Flex>
  );
}

Event.propType = {
  event: PropTypes.arrayOf(PropTypes.object).isRequired,
  happeningNow: PropTypes.arrayOf(PropTypes.number).isRequired
};
