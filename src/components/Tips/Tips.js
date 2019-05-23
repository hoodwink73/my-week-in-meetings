import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Box, Card } from "@rebass/emotion";
import useMedia from "react-use/lib/useMedia";

import DeclinePolitely from "./DeclinePolitely";
import InviteList from "./InviteList";
import ActiveParticipation from "./ActiveParticipation";

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
      <DeclinePolitely />
      <InviteList />
      <ActiveParticipation />
    </Flex>
  );
}

Tips.propTypes = {};
