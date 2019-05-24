import React from "react";
import PropType from "prop-types";

import Question from "../../Question";

const busyQuestionText = "Are you busy with more immediate tasks?";

export default function AgendaQuestion({ handleYes, handleNo }) {
  return (
    <Question
      question={busyQuestionText}
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}

AgendaQuestion.propTypes = {
  handleYes: PropType.func.isRequired,
  handleNo: PropType.func.isRequired
};
