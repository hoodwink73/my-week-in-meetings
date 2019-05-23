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
      p={4}
    >
      <Heading
        as="h2"
        mb={5}
        css={css`
          font-size: 48px;
        `}
      >
        {question}
      </Heading>
      <Box>
        <AnswerButton title="Yes" onClick={handleYes} />
        <AnswerButton title="No" onClick={handleNo} />
      </Box>
    </Flex>
  );
}

Question.propTypes = {
  question: PropTypes.node.isRequired,
  handleYes: PropTypes.func.isRequired,
  handleNo: PropTypes.func.isRequired
};
