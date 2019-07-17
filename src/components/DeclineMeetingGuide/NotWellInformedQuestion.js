import React from "react";
import PropType from "prop-types";

import Question from "../Question";

const question = "Are you well informed about your role in the meeting?";

export default function NotWellInformedQuestion({ handleYes, handleNo }) {
  return (
    <Question question={question} handleYes={handleYes} handleNo={handleNo} />
  );
}

NotWellInformedQuestion.propTypes = {
  handleYes: PropType.func.isRequired,
  handleNo: PropType.func.isRequired
};
