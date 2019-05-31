import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import AnswerButton from "../AnswerButton";

export default function Question({ question, handleYes, handleNo }) {
  return (
    <Flex
      width={9 / 10}
      mx="auto"
      my={3}
      flexDirection="column"
      justifyContent="center"
    >
      <Text mb={3} fontSize={3}>
        {question}
      </Text>
      <Flex width={1} mb={2} alignItems="center">
        <AnswerButton title="Yes" onClick={handleYes} mr={2} />
        <AnswerButton title="No" onClick={handleNo} />
      </Flex>
    </Flex>
  );
}

Question.propTypes = {
  question: PropTypes.node.isRequired,
  handleYes: PropTypes.func.isRequired,
  handleNo: PropTypes.func.isRequired
};
