import React from "react";
import PropTypes from "prop-types";

import Response from "./Response";

const content = `
Although the topic of the meeting is relevant to me, it is outside the scope of my immediate priorities.

But I will await the summary of the meeting. And keep myself updated.
`;

export default function BusyResponse({ onDeclineResponse }) {
  return <Response content={content} onDeclineResponse={onDeclineResponse} />;
}

BusyResponse.propTypes = {
  onDeclineResponse: PropTypes.func.isRequired
};
