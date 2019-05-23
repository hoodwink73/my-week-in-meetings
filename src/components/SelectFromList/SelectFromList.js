import React from "react";
import PropType from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

export default function SelectFromList({ options, selectOption }) {
  return (
    <Flex>
      {options.map((option, index) => (
        <Text key={index} onClick={selectOption}>
          {option}
        </Text>
      ))}
    </Flex>
  );
}

SelectFromList.propTypes = {
  options: PropType.arrayOf(PropType.string).isRequired,
  selectOption: PropType.func.isRequired
};
