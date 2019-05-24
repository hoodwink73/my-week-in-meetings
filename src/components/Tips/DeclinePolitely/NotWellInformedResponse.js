import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

import Copy from "../../Copy";

export default function NotWellInformedResponse() {
  return (
    <Copy
      content={`
        I am not well informed about the discussion topic.

        So, I will like to opt out of this meeting.
  `}
    />
  );
}
