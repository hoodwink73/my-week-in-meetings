import React from "react";
import PropTypes from "prop-types";

import Response from "./Response";

const content = `
  I am not well informed about the discussion topic.

  So, I will like to opt out of this meeting.
`;

export default function NotWellInformedResponse({ onDeclineResponse }) {
  return <Response content={content} onDeclineResponse={onDeclineResponse} />;
}

NotWellInformedResponse.propTypes = {
  onDeclineResponse: PropTypes.func.isRequired
};
