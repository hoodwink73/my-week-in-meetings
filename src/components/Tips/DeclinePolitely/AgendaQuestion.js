import React from "react";
import PropType from "prop-types";
import { Flex, Box, Text, Heading, Card } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import Question from "../../Question";
import { CARD_TITLE } from "./index";

const agendaQuestionText = "Is the agenda of the meeting unclear?";

export default function AgendaQuestion({ handleYes, handleNo }) {
  return (
    <Question
      question={agendaQuestionText}
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}

AgendaQuestion.propTypes = {
  handleYes: PropType.func.isRequired,
  handleNo: PropType.func.isRequired
};
