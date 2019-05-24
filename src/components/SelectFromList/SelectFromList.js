import React from "react";
import PropType from "prop-types";
import { Flex, Box, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function SelectFromList({ options, selectOption }) {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      css={css`
        height: 100%;
      `}
    >
      {options.map((option, index) => (
        <Button
          key={index}
          width={[4 / 5, 3 / 5]}
          bg="primary.5"
          color="white"
          mr={[0, 5]}
          mb={[4]}
          p={[2, 4]}
          fontSize={[3, 4]}
          onClick={() => selectOption(index)}
          css={css`
            font-weight: bold;
            box-shadow: 6px 6px 1px 0 #2186eb;
            cursor: pointer;
          `}
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
