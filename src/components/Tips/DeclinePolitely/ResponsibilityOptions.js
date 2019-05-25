import React from "react";
import PropType from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

import SelectFromList from "../../SelectFromList";

const options = [
  "You are not well informed",
  "The meeting agenda is beyond your responsibility",
  "You cannot make the decision"
];

export default function ResponsibilityOptions({ selectOption }) {
  return <SelectFromList options={options} selectOption={selectOption} />;
}

ResponsibilityOptions.propTypes = {
  handleYes: PropType.func.isRequired,
  handleNo: PropType.func.isRequired
};
