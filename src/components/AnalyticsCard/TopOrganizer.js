import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey } from "../../utils";

const KEY_FOR_AGGREGATED_DATA = "rankCollaborators";

export default function TopOrganizer({ data }) {
  let noDataAvailable = false;
  // accumulated over last few weeks
  let sortedMeetingTimeByOrganizers = sortCollectionByKey(
    data.reduce((acc, aggregateForOneWeek) => {
      const eventsByOrganizers =
        aggregateForOneWeek && aggregateForOneWeek[KEY_FOR_AGGREGATED_DATA];
      if (eventsByOrganizers) {
        return acc.concat([eventsByOrganizers]);
      } else {
        return acc;
      }
    }, []),
    "desc"
  );

  // the person who invited me to most meetings
  if (!sortedMeetingTimeByOrganizers.size) {
    noDataAvailable = true;
  } else {
    var [topOrganizerEmail] = sortedMeetingTimeByOrganizers.keys();
    var [numberOfMeetings] = sortedMeetingTimeByOrganizers.values();
  }

  return noDataAvailable ? null : (
    <Text fontSize={3}>
      You attended {numberOfMeetings} organised by {topOrganizerEmail}
    </Text>
  );
}

TopOrganizer.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType)
};
