import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey, getUserDomain } from "../../utils";

const KEY_FOR_AGGREGATED_DATA = "eventCreatorByDomainsFrequency";

export default function MeetingsByDomains({ data }) {
  const { user } = useAuthState(firebase.auth());
  const userDomain = getUserDomain(user);
  let noDataAvailable = false;
  // accumulated over last few weeks
  let sortedMeetingsByDomains = sortCollectionByKey(
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
  if (!sortedMeetingsByDomains.size) {
    noDataAvailable = true;
  } else {
    var internalVsExternal = {
      internal: 0,
      external: 0
    };

    for (let [domain, numberOfMeetings] of sortedMeetingsByDomains) {
      if (domain === userDomain) {
        internalVsExternal.internal += numberOfMeetings;
      } else {
        internalVsExternal.external += numberOfMeetings;
      }
    }
  }

  return noDataAvailable ? null : (
    <Text fontSize={3}>
      You attended {internalVsExternal.external} external meetings and{" "}
      {internalVsExternal.internal} internal meetings
    </Text>
  );
}

MeetingsByDomains.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType)
};
