import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import moment from "moment";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey } from "../../utils";
import { DAYS_OF_WEEKS } from "../../constants";

const KEY_FOR_AGGREGATED_DATA = "eventsFrequencyByDayOfWeek";

export default function BusiestDay({ data }) {
  let noDataAvailable = false;
  // accumulated over last few weeks
  let sortedMeetingTimeByDays = sortCollectionByKey(
    data.reduce((acc, aggregateForOneWeek) => {
      const eventsByday =
        aggregateForOneWeek && aggregateForOneWeek[KEY_FOR_AGGREGATED_DATA];
      if (eventsByday) {
        return acc.concat([eventsByday]);
      } else {
        return acc;
      }
    }, []),
    "desc"
  );

  var busiestDay;
  if (!sortedMeetingTimeByDays.size) {
    noDataAvailable = true;
  } else {
    const [busiestDayIndex] = sortedMeetingTimeByDays.keys();
    busiestDay = DAYS_OF_WEEKS[busiestDayIndex];
  }

  return noDataAvailable ? null : (
    <Text fontSize={3}>
      Looks like, {busiestDay} has been your busiest day over the last month
    </Text>
  );
}

BusiestDay.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType)
};
