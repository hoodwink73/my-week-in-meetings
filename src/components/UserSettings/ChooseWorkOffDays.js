import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { UserConfigContext } from "../UserConfig";
import { DAYS_OF_WEEKS } from "../../constants";

// Arrange days such that Sunday is the last day of the week
// but its value still is 0
var [Sunday, ...restOfWeek] = DAYS_OF_WEEKS;
restOfWeek = restOfWeek.map((day, index) => [day, index + 1]);
var daysOfWeek = new Map([...restOfWeek, [Sunday, 0]]);

function Day({ value, day, checked, onChange }) {
  return (
    <Flex mr={2} mb={2}>
      <input
        type="checkbox"
        id={day}
        name="days-off-in-week"
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={day}
        css={css`
          margin-left: 4px;
        `}
      >
        {day}
      </label>
    </Flex>
  );
}

Day.propTypes = {
  day: PropTypes.oneOf([...DAYS_OF_WEEKS]),
  value: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6]),
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired
};

export default function ChooseWorkOffDays({ daysOfWork, onChange, ...props }) {
  return (
    <Box {...props}>
      <Text fontSize={2} fontWeight="bold" mb={3}>
        Choose your off days
      </Text>
      <Flex flexWrap="wrap">
        {Array.from(daysOfWeek.entries()).map(([day, value]) => {
          return (
            <Day
              key={day}
              value={value}
              day={day}
              onChange={onChange}
              checked={!daysOfWork.includes(value)}
            />
          );
        })}
      </Flex>
    </Box>
  );
}

ChooseWorkOffDays.propTypes = {
  ...Box.propTypes
};
