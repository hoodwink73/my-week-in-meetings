import React from "react";
import PropType from "prop-types";

import Question from "../Question";

const busyQuestionText = "Does this meeting seem like a priority?";

export default function BusyQuestion({ handleYes, handleNo }) {
  return (
    <Question
      question={busyQuestionText}
      handleYes={handleYes}
      handleNo={handleNo}
    />
  );
}

BusyQuestion.stepName = "BusyQuestion";

BusyQuestion.propTypes = {
  handleYes: PropType.func.isRequired,
  handleNo: PropType.func.isRequired
};
