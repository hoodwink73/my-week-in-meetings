import React, { useState, useCallback } from "react";
import { Flex, Box, Card } from "@rebass/emotion";

import PropTypes from "prop-types";

import DeclineMeetingTip from "./DeclineMeetingTip";

export default function Tips() {
  return (
    <Flex mt={2} mb={4}>
      <DeclineMeetingTip />
    </Flex>
  );
}

Tips.propTypes = {};
