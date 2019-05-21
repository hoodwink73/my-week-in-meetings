/** @jsx jsx */
import React, { useReducer, useCallback } from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";
import { css, jsx } from "@emotion/core";
import { useClipboard } from "use-clipboard-copy";
import useMedia from "react-use/lib/useMedia";

import Modal from "../Modal";
import { ReactComponent as DuplicateIcon } from "../../icons/icon-duplicate.svg";
import { ReactComponent as NavigationBackIcon } from "../../icons/icon-cheveron-left-circle.svg";

const POSSIBLE_SUGGESTIONS = ["agenda", "priority", "value"];

const CONTENT = {
  agenda: {
    title: "Agenda of the meeting is unclear",
    suggestions: [
      `
      I am unclear about the agenda of the meeting. Can you please clarify it?

      If the meeting requires me to preapre something, can you list them?
    `
    ]
  },
  value: {
    title: "Scope of the meeting does not fit my responsibilities",
    suggestions: [
      `
      I am not well informed about the discussion topic.

      So, I will like to opt out of this meeting.
    `,
      `
    The meeting agenda is outside the purview of my role. So, I will like to opt out of this meeting.

    If you think otherwise, please let me know how can I make myself useful.
  `,
      `
    The meeting expects me to take a decision. But I do not have the authority.

    So, I will like to opt out of this meeting.
  `
    ]
  },
  priority: {
    title: "Busy with more important tasks",
    suggestions: [
      `Although the topic of the meeting is relevant to me, it is outside the scope of my immediate priorities.

      But I will await the summary of the meeting. And keep myself updated.
    `
    ]
  }
};

const reducer = (state, action) => {
  return action.type;
};

const CopyResponse = ({ text, ...props }) => {
  const clipboard = useClipboard();
  const handleCopy = useCallback(() => {
    clipboard.copy(text); // programmatically copying a value
  }, [clipboard.copy, text]);

  return (
    <Button onClick={handleCopy} variant="copy" {...props}>
      <DuplicateIcon />
    </Button>
  );
};

export default function DeclineMeetingTip() {
  const [state, dispatch] = useReducer(reducer, "close");

  const isLarge = useMedia("(min-width: 64em)");

  const handleOpen = () => {
    dispatch({ type: "open" });
  };

  const handleClose = () => {
    dispatch({ type: "close" });
  };

  const problems = [];

  for (let [key, problem] of Object.entries(CONTENT)) {
    problems.push(
      <Card
        as={Flex}
        alignItems="center"
        width={[1, 3 / 7]}
        bg="purple.4"
        key={key}
        p={3}
        my={[2, 3]}
        mr={[0, 4]}
        borderRadius={[10]}
        flex={["1 0 auto", "0 0 auto"]}
        css={css`
          cursor: pointer;
          min-height: ${isLarge ? "150px" : "auto"};
          box-shadow: 6px 6px 1px 0 #7069fa8a;
          transition: box-shadow 200ms;
          &:hover {
            box-shadow: 8px 8px 1px 0 #7069fa8a;
          }
        `}
        onClick={() => dispatch({ type: key })}
      >
        <Text fontSize={[2, 3]} color="white.0" textAlign="center">
          {problem.title}
        </Text>
      </Card>
    );
  }

  const Problems = () => {
    return (
      <Box width={[1, 600]} px={[4, 5]} py={[0, 4]}>
        <Text fontSize={[3, 4]} fontWeight="bold" />
        <Box>
          <Text fontWeight="bold" fontSize={[4, 3]}>
            Here are a few reasons to decline a meeting.
          </Text>
          <Text mt={2} fontSize={[4, 3]}>
            We provide plausible responses for each reason.
          </Text>
        </Box>
        <Flex flexWrap="wrap" mt={[3, 4]}>
          {problems}
        </Flex>
      </Box>
    );
  };

  const Suggestion = () => (
    <Box width={1}>
      <Flex width={1} flexDirection="column" alignItems={"center"}>
        <Box
          onClick={() => dispatch({ type: "open" })}
          width={24}
          alignSelf="flex-start"
          ml={2}
          mt={2}
          css={css`
            position: absolute;
            top: 2px;
          `}
        >
          <NavigationBackIcon />
        </Box>

        {CONTENT[state].suggestions.map((suggestion, index) => (
          <Card
            key={index}
            width={[3 / 4]}
            mt={[2]}
            mb={[3]}
            p={[3]}
            borderRadius={8}
            bg="white.1"
          >
            <Flex flexDirection="row">
              <Text
                fontSize={[4, 3]}
                css={css`
                  white-space: pre-line;
                `}
              >
                {suggestion}
              </Text>
              <CopyResponse
                text={suggestion}
                width={[64, 28]}
                alignSelf="flex-start"
              />
            </Flex>
          </Card>
        ))}
      </Flex>
    </Box>
  );

  return (
    <>
      <Modal
        isOpen={["open", ...POSSIBLE_SUGGESTIONS].includes(state)}
        contentFit={isLarge ? true : false}
        onRequestClose={handleClose}
      >
        <Flex
          width={[1, 600]}
          justifyContent="center"
          alignItems={["center", "flex-start"]}
          bg="white.0"
          css={css`
            height: 100%;
          `}
        >
          {state === "open" && <Problems />}
          {POSSIBLE_SUGGESTIONS.includes(state) && <Suggestion />}
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
        <Text fontWeight="bold">When to decline meetings</Text>
      </Card>
    </>
  );
}
