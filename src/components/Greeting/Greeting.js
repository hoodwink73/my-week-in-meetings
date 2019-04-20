import React from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@rebass/emotion";

export default function Greeting({ name, ...rest }) {
  return (
    <Box {...rest}>
      <Text fontSize={2} fontWeight="bold">
        Hello, {name}
      </Text>
    </Box>
  );
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  ...Box.propTypes
};
