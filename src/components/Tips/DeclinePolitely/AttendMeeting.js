import React from "react";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function AttendMeeting() {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      css={css`
        height: 100%;
      `}
    >
      <Text
        fontSize={[4, 5]}
        fontWeight="bold"
        bg="primary.4"
        color="white"
        p={4}
        css={css`
          transform: skew(-10deg);
        `}
      >
        You shall attend
      </Text>
    </Flex>
  );
}
