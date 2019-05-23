import React, { useReducer, useCallback } from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useClipboard } from "use-clipboard-copy";
import useMedia from "react-use/lib/useMedia";

import Modal from "../../Modal";

import AgendaQuestion from "./AgendaQuestion";
import AgendaResponse from "./AgendaResponse";

import ResponsibilityQuestion from "./ResponsibilityQuestion";
import ResponsibilityOptions from "./ResponsibilityOptions";

const attendMeetingFlowchart = new Map([
  [AgendaQuestion, [AgendaResponse, ResponsibilityQuestion]],
  [ResponsibilityQuestion, [ResponsibilityOptions, "BusyQuestion"]],
  [
    ResponsibilityOptions,
    [
      "ScopeBeyondResponsibilityResponse",
      "RoleMismatchResponse",
      "AbsentAuthorityResponse"
    ]
  ],
  ["BusyQuestion", ["BusyResponse", "AttendMeeting"]]
]);

const reducer = (state, action) => {
  switch (action.type) {
    case "open":
      return AgendaQuestion;
    case "close":
      return action.type;
    case "yes":
      if (attendMeetingFlowchart.has(state)) {
        return attendMeetingFlowchart.get(state)[0];
      } else {
        return state;
      }
    case "no":
      if (attendMeetingFlowchart.has(state)) {
        return attendMeetingFlowchart.get(state)[1];
      } else {
        return state;
      }
    case "select":
      if (attendMeetingFlowchart.has(state)) {
        return attendMeetingFlowchart.get(state)[action.index];
      } else {
        return state;
      }

    default:
      return state;
  }
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

  const handleYes = () => {
    dispatch({ type: "yes" });
  };

  const handleNo = () => {
    dispatch({ type: "no" });
  };

  const selectOption = index => {
    dispatch({ type: "select", index });
  };

  const isThisAListItem = state =>
    attendMeetingFlowchart.get(ResponsibilityOptions).includes(state);

  const Component = state;

  return (
    <>
      <Modal isOpen={state !== "close"} onRequestClose={handleClose}>
        {state !== "close" && (
          <Component
            {...(isThisAListItem(state)
              ? { selectOption }
              : { handleYes, handleNo })}
          />
        )}
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
        <Text fontWeight="bold">
          Learn when to say no to meetings, politely
        </Text>
      </Card>
    </>
  );
}
