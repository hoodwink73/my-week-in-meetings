import React, { useState, useCallback } from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";

import Modal from "../Modal";

export default function InviteList() {
  const [isModalOpen, setModalOpen] = useState(false);
  const isLarge = useMedia("(min-width: 64em)");

  const handleOpen = useCallback(() => {
    setModalOpen(true);
  }, [isModalOpen]);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, [isModalOpen]);

  const inviteListSuggestions = [
    "who has the most knowledge",
    "who will have a lot to do with the implementation",
    "who will be directly impacted",
    "who might learn from participating"
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
            Criterias to extend invitation among your team
          </Text>

          <Box>
            <ul>
              {inviteListSuggestions.map((text, index) => (
                <li key={index}>
                  <Text
                    fontSize={3}
                    mb={[3, 2]}
                    css={css`
                      line-height: 1.5;
                    `}
                  >
                    {text}
                  </Text>
                </li>
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
        <Text fontWeight="bold">Be thoughtful with your invite list</Text>
      </Card>
    </>
  );
}
