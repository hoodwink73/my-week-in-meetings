import React, { useState, useCallback } from "react";
import { Flex, Box, Card, Text, Button, Heading } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";

import { FadeIn } from "../Animate";

export default function TipTitle({ title }) {
  const isLarge = useMedia("(min-width: 64em)");
  return (
    <Box
      width={[0, 2 / 5]}
      css={css`
         {
          height: calc(100% + 55px);
          margin-top: -55px;
          margin-left: -20px;
          display: ${isLarge ? "block" : "none"};
        }
      `}
    >
      <FadeIn>
        <Card
          as={Flex}
          alignItems="center"
          bg="primary.1"
          css={css`
            height: 100%;
          `}
        >
          <Heading
            as="h1"
            p={4}
            fontSize={[6]}
            css={css`
              line-height: 1.25;
              font-weight: bold;
            `}
          >
            {title}
          </Heading>
        </Card>
      </FadeIn>
    </Box>
  );
}
