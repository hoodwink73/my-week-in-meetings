import React, { useContext } from "react";
import PropTypes from "prop-types";
import delve from "dlv";
import { Box, Card, Text } from "@rebass/emotion";
import { FirestoreDataContext } from "../FirestoreData";

export default function AnalyticsCard() {
  const { aggregatedEvents } = useContext(FirestoreDataContext);

  const isDataForThisWeekLoading =
    delve(aggregatedEvents, "loading", false) && aggregatedEvents.loading[0];
  const areDataForLastWeeksLoading =
    delve(aggregatedEvents, "loading", false) && aggregatedEvents.loading[1];

  const getDataForThisWeek =
    delve(aggregatedEvents, "data", null) && aggregatedEvents.data[0];
  const getDataForLastWeeks =
    delve(aggregatedEvents, "data.1", null) && aggregatedEvents.data.slice(1);

  // loading
  //  - both
  //  - this week - false, last three weeks - true

  return (
    <Card width={[1, 600]} borderRadius={4} bg="gray.0">
      <Text fontFamily="sans" fontSize={3} p={4} lineHeight={1.5}>
        Busiest day of the week (aggregated over last four weeks) Monthly
        meeting time trend (relative to last month) Total Amount of time spent
        in meetings this week Average duration of meetings (this week or this
        month) Meetings organised vs meetings invited to or who invites you to
        most meetings Meetings with folks oustide company vs meeting with folks
        inside company
      </Text>
    </Card>
  );
}

AnalyticsCard.propTypes = {
  type: PropTypes.string.isRequired
};
