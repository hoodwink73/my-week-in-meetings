/** @jsx jsx */
import React, { useReducer, useCallback } from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";
import { css, jsx } from "@emotion/core";
import { useClipboard } from "use-clipboard-copy";
import useMedia from "react-use/lib/useMedia";

import Modal from "../Modal";

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
        width={1}
        bg="gray.0"
        key={key}
        p={4}
        my={[3, 4]}
        borderRadius={[10]}
        css={css`
          cursor: pointer;
        `}
        onClick={() => dispatch({ type: key })}
      >
        <Text fontSize={[4, 3]}>{problem.title}</Text>
      </Card>
    );
  }

  const Problems = () => {
    return (
      <Box width={[1, 600]}>
        <Text fontSize={[5, 4]} fontWeight="bold">
          Why do you think you shouldn't attend the meeting
        </Text>
        <Box mt={[5, 4]}>{problems}</Box>
      </Box>
    );
  };

  const Suggestion = () => (
    <Box>
      <Text onClick={() => dispatch({ type: "open" })} m={3}>
        Back
      </Text>
      <Card width={[1, 600]} mt={[2, 4]} p={[3]} borderRadius={8} bg="gray.0">
        <Text fontSize={[3, 4]}>{CONTENT[state].suggestion}</Text>
        <Button
          onClick={handleCopy}
          fontSize="2"
          mt={3}
          css={css`
            cursor: pointer;
          `}
        >
          {clipboard.copied ? "Copied" : "Copy Suggestion"}
        </Button>
      </Card>
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
          css={css`
            height: 100%;
          `}
        >
          {state === "open" && <Problems />}
          {POSSIBLE_SUGGESTIONS.includes(state) && <Suggestion />}
        </Flex>
      </Modal>

      <Card
        bg="gray.0"
        width={1 / 3}
        p={3}
        fontSize={3}
        borderRadius={8}
        css={css`
          cursor: pointer;
        `}
        onClick={handleOpen}
      >
        <Text fontWeight="bold">Decline Meetings, politely</Text>
      </Card>
    </>
  );
}
