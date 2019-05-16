import React from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import moment from "moment";
import leftPad from "left-pad";

const roundOffTimeUnit = (time, unit) => {
  if (unit === "hours") {
    // we need not round off the hours as we will be providing
    // th minutes
    return leftPad(parseInt(time, 10), 2, 0);
  } else if (unit === "minutes") {
    return leftPad(parseFloat(time).toFixed(0), 2, 0);
  }
};

export default function Time({ timeInMs, as: Component, ...props }) {
  const duration = moment.duration(timeInMs);

  return (
    <Component {...props}>
      {`${roundOffTimeUnit(duration.asHours(), "hours")} hrs ${
        duration.minutes()
          ? `${roundOffTimeUnit(duration.minutes(), "minutes")} mins`
          : ""
      }`}
    </Component>
  );
}

Time.propTypes = {
  timeInMs: PropTypes.number.isRequired,
  as: PropTypes.node.isRequired
};
