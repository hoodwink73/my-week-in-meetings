import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Button } from "@rebass/emotion";
import { useClipboard } from "use-clipboard-copy";

export default function Copy({ content }) {
  const clipboard = useClipboard();

  return (
    <Box>
      <Text innerRef={clipboard.target}>{content}</Text>
      <Button onClick={clipboard.copy}>Copy</Button>
    </Box>
  );
}

Copy.propTypes = {
  content: PropTypes.string.isRequired
};
