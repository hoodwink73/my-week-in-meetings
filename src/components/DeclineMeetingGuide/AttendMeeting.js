import React from "react";
import { Flex, Box, Text, Image } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";
import AttendMeetingImage from "../../images/attend-meeting-alt.png";

export default function AttendMeeting() {
  const isLarge = useMedia("(min-width: 64em)");

  return (
    <Flex justifyContent="center">
      <Image
        width="auto"
        src={AttendMeetingImage}
        css={css`
          height: ${isLarge ? "366px" : "25vh"};
        `}
      />
    </Flex>
  );
}
