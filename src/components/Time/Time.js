import React from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import moment from "moment";
import leftPad from "left-pad";

export default function Time({ timeInMs, as: Component, ...props }) {
  const duration = moment.duration(timeInMs);

  return (
    <Component {...props}>
      {`${parseInt(parseFloat(duration.asHours()).toFixed(2), 10)} hrs ${
        duration.minutes() ? `${leftPad(duration.minutes(), 2, 0)} mins` : ""
      }`}
    </Component>
  );
}

Time.propTypes = {
  timeInMs: PropTypes.number.isRequired,
  as: PropTypes.node.isRequired
};
