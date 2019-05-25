import React, { useState, useCallback } from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";

import Modal from "../Modal";
import TipTitle from "./TipTitle";
import { SlideUp } from "../Animate";
import ListItem from "../ListItem";

const CARD_TITLE = "How to make most out of your meetings";

export default function ActiveParticipation() {
  const [isModalOpen, setModalOpen] = useState(false);
  const isLarge = useMedia("(min-width: 64em)");

  const handleOpen = useCallback(() => {
    setModalOpen(true);
  }, [isModalOpen]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, [isModalOpen]);

  const suggestions = [
    <Box mb={[3]}>
      <Text
        fontWeight="bold"
        fontSize={[3]}
        css={css`
          font-style: italic;
        `}
      >
        Own your perspective
      </Text>
      <Text>Perspective shapes participation</Text>
    </Box>,
    <Box mb={[3]}>
      <Text
        fontWeight="bold"
        fontSize={[3]}
        css={css`
          font-style: italic;
        `}
      >
        Focused Listening
      </Text>
      <Text>Be patient and non-judgemental</Text>
    </Box>,
    <Box mb={[3]}>
      <Text
        fontWeight="bold"
        fontSize={[3]}
        css={css`
          font-style: italic;
        `}
      >
        Focused Speaking
      </Text>
      <Text>Be clear consise and relevant</Text>
    </Box>,
    <Box mb={[3]}>
      <Text
        fontWeight="bold"
        fontSize={[3]}
        fontStyle="italic"
        css={css`
          font-style: italic;
        `}
      >
        Be Self Aware
      </Text>
      <Text>Ask for information you need</Text>
      <Text>Be thoughtful in your responses</Text>
    </Box>
  ];

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={handleClose}>
        <Flex
          width={[1]}
          justifyContent="space-between"
          css={css`
            height: 100%;
          `}
        >
          <TipTitle title={CARD_TITLE} />

          <Flex width={[1, 3 / 5]} justifyContent="center" alignItems="center">
            <SlideUp>
              <ul
                css={css`
                  height: 100%;
                `}
              >
                {" "}
                <Flex
                  flexDirection="column"
                  justifyContent="center"
                  css={css`
                    height: 100%;
                  `}
                >
                  {suggestions.map((text, index) => (
                    <Box width={1} key={index}>
                      <li key={index}>
                        <ListItem content={text} />
                      </li>
                    </Box>
                  ))}
                </Flex>
              </ul>
            </SlideUp>
          </Flex>
        </Flex>
      </Modal>

      <Card
        bg="white.1"
        width={[1 / 2, 1 / 3]}
        p={3}
        fontSize={[2, 3]}
        borderRadius={8}
        css={css`
          cursor: pointer;
        `}
        mr={2}
        onClick={handleOpen}
      >
        <Text fontWeight="bold">{CARD_TITLE}</Text>
      </Card>
    </>
  );
}
