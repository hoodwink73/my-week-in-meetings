import React, { useContext } from "react";
import PropTypes from "prop-types";
import delve from "dlv";

import TimeSpentInMeetings from "./TimeSpentInMeetings";
import BusiestDay from "./BusiestDay";
import TopCollaborator from "./TopCollaborator";
import MeetingsByDomains from "./MeetingsByDomains";
import AverageMeetingDuration from "./AverageMeetingDuration";

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
    case "busiestDay":
    case "topCollaborator":
    case "meetingsByDomains":
    case "timeSpentInMeetings":
    case "averageMeetingDuration":
      loading = areDataForLastWeeksLoading;
      data = [dataForThisWeek, ...dataForLastWeeks];
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
    case "topCollaborator":
      Component = TopCollaborator;
      break;
    case "meetingsByDomains":
      Component = MeetingsByDomains;
      break;
    case "averageMeetingDuration":
      Component = AverageMeetingDuration;
      break;
    default:
      Component = "div";
  }

  if (error) {
    console.error(error);
  }

  if (!loading & !error) {
    return (
      <Component
        data={data}
        flex={["0 0 auto"]}
        width={[9 / 10, "calc(50% - 8px)"]}
        {...props}
      />
    );
  } else {
    return null;
  }
}

AnalyticsCard.propTypes = {
  type: PropTypes.oneOf([
    "timeSpentInMeetings",
    "busiestDay",
    "topCollaborator",
    "meetingsByDomains",
    "averageMeetingDuration"
  ])
};
