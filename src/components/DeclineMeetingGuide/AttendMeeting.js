import React from "react";
import { Flex, Box, Text, Image } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";
import Button from "../Button";

export default function AttendMeeting({ handleYes }) {
  const isLarge = useMedia("(min-width: 64em)");

  return (
    <Flex flexDirection="column" justifyContent="center" mx="auto" my={3}>
      <Text mb={3} fontSize={3}>
        The meeting looks reasonable. Attend, you shall!
      </Text>

      <Box width={[1 / 2, 1 / 3]}>
        <Button mb={2} type="primary" size="small" onClick={handleYes}>
          See you later!
        </Button>
      </Box>
    </Flex>
  );
}
