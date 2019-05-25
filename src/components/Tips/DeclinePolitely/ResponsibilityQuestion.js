import React from "react";
import PropType from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

import Question from "../../Question";

const agendaQuestionText =
  "Does the scope of the meeting lie beyond your key responsibilities?";

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
