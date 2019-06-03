import React from "react";
import PropTypes from "prop-types";

import Response from "./Response";

const content = `
I am unclear about the agenda of the meeting. Can you please clarify it?

If the meeting requires me to prepare something, can you list them?
`;

export default function AgendaResponse({ onDeclineResponse }) {
  return <Response content={content} onDeclineResponse={onDeclineResponse} />;
}

AgendaResponse.propTypes = {
  onDeclineResponse: PropTypes.func.isRequired
};
