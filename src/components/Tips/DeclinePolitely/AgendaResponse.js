import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

import Copy from "../../Copy";

export default function AgendaResponse() {
  return (
    <Copy
      content={`
    I am unclear about the agenda of the meeting. Can you please clarify it?

    If the meeting requires me to preapre something, can you list them?
  `}
    />
  );
}
