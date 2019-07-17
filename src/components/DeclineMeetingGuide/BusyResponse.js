import React from "react";
import PropTypes from "prop-types";

import Response from "./Response";

const content = `
Unfortunately I will have to decline this meeting as I am occupied with other priorities. But please do keep me posted on this.
`;

export default function BusyResponse({ onDeclineResponse }) {
  return <Response content={content} onDeclineResponse={onDeclineResponse} />;
}

BusyResponse.propTypes = {
  onDeclineResponse: PropTypes.func.isRequired
};
