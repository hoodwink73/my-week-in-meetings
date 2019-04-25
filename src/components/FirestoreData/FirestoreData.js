import React, { createContext } from "react";
import PropTypes from "prop-types";

import { userAggregatedEventData } from "../../hooks";

export const FirestoreDataContext = createContext({
  aggregatedEvents: null
});

export default function FirestoreData({ children, googleID }) {
  const aggregatedEvents = userAggregatedEventData(googleID);
  return (
    <FirestoreDataContext.Provider value={{ aggregatedEvents }}>
      {children}
    </FirestoreDataContext.Provider>
  );
}

FirestoreData.propTypes = {
  children: PropTypes.node.isRequired,
  googleID: PropTypes.string.isRequired
};
