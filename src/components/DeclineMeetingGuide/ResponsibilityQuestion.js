import React from "react";
import PropType from "prop-types";

import Question from "../Question";

const question =
  "Does the scope of the meeting lie within your key responsibilities?";

export default function ResponsibilityQuestion({ handleYes, handleNo }) {
  return (
    <Question question={question} handleYes={handleYes} handleNo={handleNo} />
  );
}

ResponsibilityQuestion.propTypes = {
  handleYes: PropType.func.isRequired,
  handleNo: PropType.func.isRequired
};
