import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card, Heading, Button } from "@rebass/emotion";
import { useClipboard } from "use-clipboard-copy";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function Copy({ content }) {
  const clipboard = useClipboard({ copiedTimeout: 2000 });

  const handleCopy = useCallback(() => {
    clipboard.copy(content);
  }, [clipboard.copy, content]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      css={css`
        height: 100%;
      `}
    >
      <Box width={[1, 3 / 5]} m={[3, 0]}>
        <Card bg="primary.1" borderRadius={16}>
          <Heading
            as="h3"
            p={4}
            css={css`
              font-size: 24px;
              white-space: pre-line;
            `}
          >
            {content}
          </Heading>
        </Card>
        <Flex width={1} justifyContent={["center", "flex-start"]}>
          <Button
            width={2 / 5}
            bg="primary.5"
            mt={4}
            css={css`
              font-size: 24px;
              font-weight: bold;
              box-shadow: 6px 6px 1px 0 #2186eb;
              cursor: pointer;
            `}
            onClick={handleCopy}
          >
            {clipboard.copied ? "Copied" : "Copy"}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}

Copy.propTypes = {
  content: PropTypes.string.isRequired
};
