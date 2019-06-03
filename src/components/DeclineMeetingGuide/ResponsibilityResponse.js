import React from "react";
import PropTypes from "prop-types";

import Response from "./Response";

const content = `
The meeting agenda is outside the purview of my role. So, I will like to opt out of this meeting.

If you think otherwise, please let me know how can I make myself useful.
`;

export default function ResponsibilityResponse({ onDeclineResponse }) {
  return <Response content={content} onDeclineResponse={onDeclineResponse} />;
}

ResponsibilityResponse.propTypes = {
  onDeclineResponse: PropTypes.func.isRequired
};
