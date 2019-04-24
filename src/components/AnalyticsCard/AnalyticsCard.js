import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Box, Card, Text } from "@rebass/emotion";
import { EventsContext } from "../MyEventsSummary";

export default function AnalyticsCard() {
  const { eventsThisWeek, aggregatedDataThisWeek } = useContext(EventsContext);

  return (
    <Card width={[1, 600]} borderRadius={4} bg="gray.0">
      <Text fontFamily="sans" fontSize={3} p={4} lineHeight={1.5}>
        Wednesday has been your busiest day. You had 3 meetings for 2 hours.
      </Text>
    </Card>
  );
}

AnalyticsCard.propTypes = {
  type: PropTypes.string.isRequired
};
