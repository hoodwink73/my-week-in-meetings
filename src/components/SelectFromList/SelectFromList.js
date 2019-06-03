import React from "react";
import PropType from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Button from "../Button";

export default function SelectFromList({ options, selectOption, ...props }) {
  return (
    <Flex>
      {options.map((option, index) => (
        <Button
          key={index}
          width={[1 / 3, 1 / 3]}
          size="medium"
          type="primary"
          onClick={() => selectOption(index)}
          mr={2}
          {...props}
        >
          {option}
        </Button>
      ))}
    </Flex>
  );
}

SelectFromList.propTypes = {
  options: PropType.arrayOf(PropType.string).isRequired,
  selectOption: PropType.func.isRequired
};
