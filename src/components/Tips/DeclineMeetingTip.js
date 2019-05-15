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
    title: "The agenda of the meeting is not clear",
    suggestion:
      "Can I please get a clear agenda. Can I please get a clear agenda. Can I please get a clear agenda. Can I please get a clear agenda"
  },
  value: {
    title: "You are not the right person",
    suggestion: "Can I suggest somebody else?"
  },
  priority: {
    title: "You have other high priority task",
    suggestion: "I have other task."
  }
};

const reducer = (state, action) => {
  return action.type;
};

export default function DeclineMeetingTip() {
  const [state, dispatch] = useReducer(reducer, "close");
  const clipboard = useClipboard({ copiedTimeout: 1000 });

  const handleCopy = useCallback(() => {
    clipboard.copy(CONTENT[state].suggestion); // programmatically copying a value
  }, [clipboard.copy, state]);

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
        <Text fontSize={[3, 4]} fontWeight="bold">
          Why do you think you shouldn't attend the meeting?
        </Text>
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
        <Card
          width={[3 / 4]}
          mt={[2]}
          mb={[2]}
          p={[3]}
          borderRadius={8}
          bg="white.1"
        >
          <Text fontSize={[4, 3]}>{CONTENT[state].suggestion}</Text>
        </Card>
        <Button
          onClick={handleCopy}
          fontSize="2"
          mt={2}
          mb={2}
          variant="primary"
          css={css`
            &:hover {
              background-image: linear-gradient(-180deg, #f0f3f6, #e6ebf1 90%);
              background-position: -0.5em;
              border-color: rgba(27, 31, 35, 0.35);
            }
            &: active {
              border-color: rgba(27, 31, 35, 0.35);
              box-shadow: inset 0 0.15em 0.3em rgba(27, 31, 35, 0.15);
            }
          `}
        >
          <Flex jsutifyContent="center" alignItems="center">
            <Box width={16} mr={2}>
              <DuplicateIcon />
            </Box>
            <Text fontSize={1}>{clipboard.copied ? "Copied" : "Copy"}</Text>
          </Flex>
        </Button>
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
        <Text fontWeight="bold">Decline Meetings, politely</Text>
      </Card>
    </>
  );
}
