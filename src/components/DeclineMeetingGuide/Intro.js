import React from "react";
import PropTypes from "prop-types";
import { Flex, Card, Text } from "@rebass/emotion";

import Button from "../Button";

export default function Intro({ handleYes, handleNo }) {
  return (
    <Card width={9 / 10} mx="auto" my={3} borderRadius={0}>
      <Text fontSize={2} lineHeight={1.5}>
        The walkthrough will guide you to decline meetings appropriately. Just
        take the interactive guide and select the appropriate response to send
        when declining the meeting.
      </Text>
      <Flex width={1} justifyContent="flex-end" mt={2}>
        <Button mr={2} size="medium" variant="text" onClick={handleNo}>
          No, Thanks
        </Button>
        <Button type="primary" size="medium" onClick={handleYes}>
          Start The Guide
        </Button>
      </Flex>
    </Card>
  );
}

Intro.propTypes = {
  handleYes: PropTypes.func.isRequired,
  handleNo: PropTypes.func.isRequired
};
