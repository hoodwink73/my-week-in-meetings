import React, { useState, useEffect } from "react";
import moment from "moment";

export default function(intervalInMs) {
  const [renderCounter, setRenderCounter] = useState(0);
  const secondsInNow = moment().seconds();

  // this tries to ensure we trigger the update when the minute changes
  // in real world
  // NOTE: If you want updates to happen after duration less than a minute
  // this code will not work
  const scheduleTime = (intervalInMs / 1000 - secondsInNow) * 1000;

  useEffect(() => {
    const unsubscribeID = setTimeout(() => {
      setRenderCounter(renderCounter + 1);
    }, scheduleTime);

    return () => clearTimeout(unsubscribeID);
  });

  return renderCounter;
}
