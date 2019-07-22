import React from "react";
import PropTypes from "prop-types";

import Response from "./Response";

const content = `The agenda of this meeting is not clear to me. Unfortunately, I will have to decline this meeting for now.

Please feel free to update the agenda and invite me again.
`;

export default function AgendaResponse({ onDeclineResponse }) {
  return (
    <Response
      stepName="AgendaResponse"
      content={content}
      onDeclineResponse={onDeclineResponse}
    />
  );
}

AgendaResponse.stepName = "AgendaResponse";

AgendaResponse.propTypes = {
  onDeclineResponse: PropTypes.func.isRequired
};
