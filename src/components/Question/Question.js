import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Heading } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import AnswerButton from "../AnswerButton";

export default function Question({ question, handleYes, handleNo }) {
  return (
    <Flex
      width={1}
      css={css`
        height: 100%;
      `}
      flexDirection="column"
      justifyContent="center"
      p={[3, 5]}
    >
      <Heading as="h2" mb={4} fontSize={[5, 4]} textAlign={["center", "left"]}>
        {question}
      </Heading>
      <Flex width={1} flexDirection={["column", "row"]} alignItems="center">
        <AnswerButton title="Yes" onClick={handleYes} />
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
