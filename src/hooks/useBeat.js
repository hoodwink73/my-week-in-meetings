import React, { useState, useEffect, useContext, createContext } from "react";
import moment from "moment";

const BeatContext = createContext();

export function BeatProvider({ beatEveryInMs, children }) {
  const [lastUpdated, update] = useState(moment());
  const secondsInNow = moment().seconds();

  // this tries to ensure we trigger the update when the minute changes
  // in real world
  // NOTE: If you want updates to happen after duration less than a minute
  // this code will not work
  const scheduleTime = (beatEveryInMs / 1000 - secondsInNow) * 1000;

  useEffect(() => {
    const unsubscribeID = setTimeout(() => {
      update(moment());
    }, scheduleTime);

    return () => clearTimeout(unsubscribeID);
  });

  return (
    <BeatContext.Provider value={lastUpdated}>{children}</BeatContext.Provider>
  );
}

export function useBeat() {
  const lastUpdated = useContext(BeatContext);
  return lastUpdated;
}
