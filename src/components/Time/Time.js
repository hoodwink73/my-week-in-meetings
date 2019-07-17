import React from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import moment from "moment";
import leftPad from "left-pad";

const roundOffTimeUnit = (duration, unit) => {
  if (unit === "hours") {
    // we need not round off the hours as we will be providing
    // th minutes
    return `${parseInt(duration, 10)}`;
  } else if (unit === "minutes") {
    return `${leftPad(parseFloat(duration).toFixed(0), 2, 0)}`;
  }
};

export default function Time({ timeInMs, as: Component, ...props }) {
  const duration = moment.duration(timeInMs);

  return (
    <Component {...props}>
      {`${roundOffTimeUnit(duration.asHours(), "hours")}`}
      <span
        style={{
          fontFamily: "monospace",
          marginLeft: "2px",
          marginRight: "6px"
        }}
      >
        h
      </span>
      {`${roundOffTimeUnit(duration.minutes(), "minutes")}`}
      <span style={{ fontFamily: "monospace", marginLeft: "2px" }}>m </span>
    </Component>
  );
}

Time.propTypes = {
  timeInMs: PropTypes.number.isRequired,
  as: PropTypes.node.isRequired
};
