import React from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
import moment from "moment";
import leftPad from "left-pad";

export default function Time({ timeInMs, ...props }) {
  const duration = moment.duration(timeInMs);

  return (
    <Text {...props}>
      {`${parseInt(parseFloat(duration.asHours()).toFixed(2), 10)} hrs ${
        duration.minutes() ? `${leftPad(duration.minutes(), 2, 0)} mins` : ""
      }`}
    </Text>
  );
}

Time.propTypes = {
  timeInMs: PropTypes.number.isRequired,
  ...Text.propTypes
};
