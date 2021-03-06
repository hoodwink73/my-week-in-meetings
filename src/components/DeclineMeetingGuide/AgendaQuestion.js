import React from "react";
import PropType from "prop-types";

import Question from "../Question";

const agendaQuestionText = "Is the agenda of this meeting clear to you?";

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

AgendaQuestion.stepName = "AgendaQuestion";
