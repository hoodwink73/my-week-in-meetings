import React from "react";
import PropTypes from "prop-types";
import Modal from "../Modal";

import { Flex, Box, Card, Text } from "@rebass/emotion";

export default function Illustration({ ...props }) {
  return (
    <Card bg="primary.6" {...props}>
      <Text width={[3 / 4]} color="white" fontSize={5} fontWeight="bold">
        <Text>Ready for</Text>
        <Text>Deepwork Today</Text>
      </Text>
    </Card>
  );
}

Illustration.propTypes = {
  ...Box.propTypes
};
