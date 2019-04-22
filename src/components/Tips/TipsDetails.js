import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";

import Modal from "../Modal";

export default function TipsDetails({ isOpen, details, onToggle }) {
  return (
    <Modal isOpen={isOpen} onRequestClose={onToggle}>
      <Text fontFamily="sans" fontSize={6}>
        {details[0]}
      </Text>
    </Modal>
  );
}

TipsDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  details: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func
};
