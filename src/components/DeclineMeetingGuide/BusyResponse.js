import React from "react";
import PropTypes from "prop-types";

import Response from "./Response";

const content = `
Unfortunately I will have to decline this meeting as I am occupied with other priorities. But please do keep me posted on this.
`;

export default function BusyResponse({ onDeclineResponse }) {
  return (
    <Response
      stepName="BusyResponse"
      content={content}
      onDeclineResponse={onDeclineResponse}
    />
  );
}

BusyResponse.stepName = "BusyResponse";

BusyResponse.propTypes = {
  onDeclineResponse: PropTypes.func.isRequired
};
