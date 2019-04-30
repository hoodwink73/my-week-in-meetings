import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import moment from "moment";
import delve from "dlv";

import { getWorkHours } from "../../utils";
import { UserConfigContext } from "../UserConfig";
import AggregatedDataPropType from "./AggregatedData.propType";

const WEEKS_TO_AGGREGATE_OVER = 4;
const KEY_FOR_AGGREGATED_DATA = "aggregateTotalMeetingTime";

export default function TimeSpentInMeetings({ data }) {
  const { userConfig } = useContext(UserConfigContext);

  // daily work time
  const { workStartTime, workEndTime } = getWorkHours(false, userConfig);
  const numberOfWorkingDays = userConfig.workingDays.length;
  const totalWorkTimeAvailableInMs =
    workEndTime.diff(workStartTime) *
    numberOfWorkingDays *
    WEEKS_TO_AGGREGATE_OVER;

  const totalTimeSpentInMeetingsInMs = data.reduce(
    (cumulativeMeetingTime, aggregateForAWeek = {}) => {
      return (
        cumulativeMeetingTime +
        delve(aggregateForAWeek, KEY_FOR_AGGREGATED_DATA, 0)
      );
    },
    0
  );

  const timeSpentInMeetingsAsPercent = parseInt(
    (totalTimeSpentInMeetingsInMs / totalWorkTimeAvailableInMs) * 100,
    10
  );

  return (
    <Text fontSize={3}>
      Last month, you spent {timeSpentInMeetingsAsPercent}% of time in meeting
    </Text>
  );
}

TimeSpentInMeetings.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType)
};
