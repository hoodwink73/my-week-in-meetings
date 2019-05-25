import React, { useState, useCallback } from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";

import Modal from "../Modal";
import TipTitle from "./TipTitle";
import { SlideUp } from "../Animate";
import ListItem from "../ListItem";

const CARD_TITLE = "Decide who to include in the meeting";

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
            <ul
              css={css`
                height: 100%;
              `}
            >
              <Flex
                alignItems="center"
                css={css`
                  height: 100%;
                `}
              >
                <SlideUp>
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    css={css`
                      height: 100%;
                    `}
                  >
                    {inviteListSuggestions.map((text, index) => (
                      <Box width={[1]} key={index}>
                        <li key={index}>
                          <ListItem mb={[3, 2]} content={text} />
                        </li>
                      </Box>
                    ))}
                  </Flex>
                </SlideUp>
              </Flex>
            </ul>
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
