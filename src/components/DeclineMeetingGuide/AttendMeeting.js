import React from "react";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function AttendMeeting() {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Text fontSize={2} fontWeight="bold">
        You can attend the meeting
      </Text>
    </Flex>
  );
}
