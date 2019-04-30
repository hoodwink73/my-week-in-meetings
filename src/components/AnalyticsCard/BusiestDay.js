import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import moment from "moment";
import delve from "dlv";

import AggregatedDataPropType from "./AggregatedData.propType";

const KEY_FOR_AGGREGATED_DATA = "eventsFrequencyByDayOfWeek";

const daysOfWeeks = [...Array(7).keys()].map(index =>
  moment()
    .isoWeekday(index)
    .format("dddd")
);

export default function BusiestDay({ data }) {
  let noDataAvailable = false;
  let totalMeetingTimeByDayAggregateOverWeeks = data.reduce(
    (totalMeetingTimeByDay, currentWeekAggregate) => {
      if (!currentWeekAggregate) {
        return totalMeetingTimeByDay;
      }
      let i = 0;
      const result = Object.assign({}, totalMeetingTimeByDay);
      while (i < 7) {
        result[i] =
          delve(result, `${i}`, 0) +
          delve(currentWeekAggregate, `${KEY_FOR_AGGREGATED_DATA}.${i}`, 0);
        i++;
      }

      return result;
    },
    {}
  );

  if (!Object.keys(totalMeetingTimeByDayAggregateOverWeeks).length) {
    noDataAvailable = true;
  }

  const orderedDayOfWeek = Object.keys(
    totalMeetingTimeByDayAggregateOverWeeks
  ).sort(
    (a, b) =>
      totalMeetingTimeByDayAggregateOverWeeks[b] -
      totalMeetingTimeByDayAggregateOverWeeks[a]
  );

  const busiestDay = daysOfWeeks[orderedDayOfWeek[0]];

  return noDataAvailable ? null : (
    <Text fontSize={3}>
      Looks like, {busiestDay} has been your busiest day over the last month
    </Text>
  );
}

BusiestDay.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType)
};
