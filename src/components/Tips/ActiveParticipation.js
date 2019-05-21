import React, { useState, useCallback } from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";

import Modal from "../Modal";

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
      <Text fontWeight="bold" fontSize={[3]}>
        Own your perspective
      </Text>
      <Text>Perspective shapes participation</Text>
    </Box>,
    <Box mb={[3]}>
      <Text fontWeight="bold" fontSize={[3]}>
        Focused Listening
      </Text>
      <Text>Be patient and non-judgemental</Text>
    </Box>,
    <Box mb={[3]}>
      <Text fontWeight="bold" fontSize={[3]}>
        Focused Speaking
      </Text>
      <Text>Be clear consise and relevant</Text>
    </Box>,
    <Box mb={[3]}>
      <Text fontWeight="bold" fontSize={[3]}>
        Be Self Aware
      </Text>
      <Text>Ask for information you need</Text>
      <Text>Be thoughtful in your responses</Text>
    </Box>
  ];

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        contentFit={isLarge ? true : false}
        onRequestClose={handleClose}
      >
        <Flex
          width={[1, 600]}
          flexDirection="column"
          justifyContent="center"
          alignItems={["center", "flex-start"]}
          bg="white.0"
          px={[4, 5]}
          py={[0, 4]}
          css={css`
            height: 100%;
          `}
        >
          <Text fontWeight="bold" mb="3" fontSize={[4, 3]}>
            Participate actively to make the most out of the meeting
          </Text>

          <Box width={1}>
            <ul>
              {suggestions.map((textEl, index) => (
                <li key={index}>{textEl}</li>
              ))}
            </ul>
          </Box>
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
        <Text fontWeight="bold">Participate Actively</Text>
      </Card>
    </>
  );
}
