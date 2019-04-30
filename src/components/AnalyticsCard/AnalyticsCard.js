import React, { useContext } from "react";
import PropTypes from "prop-types";
import delve from "dlv";
import { Box, Card, Text } from "@rebass/emotion";

import TimeSpentInMeetings from "./TimeSpentInMeetings";
import BusiestDay from "./BusiestDay";

import { FirestoreDataContext } from "../FirestoreData";

export default function AnalyticsCard({ type, ...props }) {
  const { aggregatedEvents } = useContext(FirestoreDataContext);

  const isDataForThisWeekLoading =
    delve(aggregatedEvents, "loading", false) && aggregatedEvents.loading[0];
  const areDataForLastWeeksLoading =
    delve(aggregatedEvents, "loading", false) && aggregatedEvents.loading[1];

  const dataForThisWeek =
    delve(aggregatedEvents, "data", []) && aggregatedEvents.data[0];
  const dataForLastWeeks =
    delve(aggregatedEvents, "data", []) && aggregatedEvents.data.slice(1);

  const error = aggregatedEvents.error;

  let loading = false;
  let data = null;
  let Component;

  switch (type) {
    case "timeSpentInMeetings":
    case "busiestDay":
      loading = areDataForLastWeeksLoading;
      data = [dataForThisWeek, ...dataForLastWeeks];
      Component = TimeSpentInMeetings;
      break;
    default:
      loading = isDataForThisWeekLoading;
      data = [dataForThisWeek];
  }

  switch (type) {
    case "timeSpentInMeetings":
      Component = TimeSpentInMeetings;
      break;
    case "busiestDay":
      Component = BusiestDay;
      break;
    default:
      Component = "div";
  }

  if (error) {
    console.error(error);
  }

  return (
    <Card width={[1, 600]} borderRadius={4} bg="gray.0" p={[3]} {...props}>
      {!loading && !error ? <Component data={data} /> : null}
    </Card>
  );
}

AnalyticsCard.propTypes = {
  type: PropTypes.oneOf(["timeSpentInMeetings"]),
  ...Card.propTypes
};
