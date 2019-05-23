import React from "react";
import PropType from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

import SelectFromList from "../../SelectFromList";

const options = [
  "Your role do not position you to get information",
  "Meeting agenda exceeds the purview of your role",
  "You do not have the authority to take a decision"
];

export default function ResponsibilityOptions({ selectOption }) {
  return <SelectFromList options={options} selectOption={selectOption} />;
}

ResponsibilityOptions.propTypes = {
  handleYes: PropType.func.isRequired,
  handleNo: PropType.func.isRequired
};
