import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

import Copy from "../../Copy";

export default function RoleMismatchResponse() {
  return (
    <Copy
      content={`
        The meeting agenda is outside the purview of my role. So, I will like to opt out of this meeting.

        If you think otherwise, please let me know how can I make myself useful.
  `}
    />
  );
}
