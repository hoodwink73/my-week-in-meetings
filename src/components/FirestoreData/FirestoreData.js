import React, { createContext } from "react";
import PropTypes from "prop-types";

import { userAggregatedEventData, useEventsForWeek } from "../../hooks";

export const FirestoreDataContext = createContext({
  eventsThisWeek: null,
  aggregatedEvents: null
});

export default function FirestoreData({ children, googleID }) {
  const aggregatedEvents = userAggregatedEventData(googleID);
  const eventsThisWeek = useEventsForWeek(0, googleID);
  return (
    <FirestoreDataContext.Provider value={{ aggregatedEvents, eventsThisWeek }}>
      {children}
    </FirestoreDataContext.Provider>
  );
}

FirestoreData.propTypes = {
  children: PropTypes.node.isRequired,
  googleID: PropTypes.string.isRequired
};
