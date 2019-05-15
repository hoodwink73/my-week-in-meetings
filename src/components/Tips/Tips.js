/** @jsx jsx */
import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { css, jsx } from "@emotion/core";
import { Flex, Box, Card } from "@rebass/emotion";
import useMedia from "react-use/lib/useMedia";

import DeclineMeetingTip from "./DeclineMeetingTip";

export default function Tips() {
  const isLarge = useMedia("(min-width: 64em)");

  return (
    <Flex
      mt={2}
      mb={4}
      width={1}
      css={css`
        overflow-x: scroll;
        & > div {
          flex-shrink: ${isLarge ? 1 : 0};
        }
      `}
    >
      <DeclineMeetingTip />
      <DeclineMeetingTip />
      <DeclineMeetingTip />
    </Flex>
  );
}

Tips.propTypes = {};
