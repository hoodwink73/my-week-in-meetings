import React, { useReducer, useCallback, useState, useEffect } from "react";
import { Flex, Box, Card, Text, Button, Heading } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useClipboard } from "use-clipboard-copy";
import useMedia from "react-use/lib/useMedia";
import { useTransition, animated } from "react-spring";

import Modal from "../../Modal";
import { FadeIn } from "../../Animate";

import AgendaQuestion from "./AgendaQuestion";
import AgendaResponse from "./AgendaResponse";

import ResponsibilityQuestion from "./ResponsibilityQuestion";
import ResponsibilityOptions from "./ResponsibilityOptions";
import NotWellInformedResponse from "./NotWellInformedResponse";
import RoleMismatchResponse from "./RoleMismatchResponse";
import NoAuthorityResponse from "./NoAuthorityResponse";

import BusyQuestion from "./BusyQuestion";
import BusyResponse from "./BusyResponse";

import AttendMeeting from "./AttendMeeting";

const attendMeetingFlowchart = new Map([
  [AgendaQuestion, [AgendaResponse, ResponsibilityQuestion]],
  [ResponsibilityQuestion, [ResponsibilityOptions, BusyQuestion]],
  [
    ResponsibilityOptions,
    [NotWellInformedResponse, RoleMismatchResponse, NoAuthorityResponse]
  ],
  [BusyQuestion, [BusyResponse, AttendMeeting]]
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

export const CARD_TITLE = "Learn when to say no to meetings, politely";
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

  const isThisAListItem = state => ResponsibilityOptions === state;

  const Component = ({ ...parentProps }) => {
    const [show, set] = useState(false);
    const transitions = useTransition(show, null, {
      from: { transform: "translate3d(0,100%,0)" },
      enter: { transform: "translate3d(0,0px,0)" },
      leave: { transform: "translate3d(0,-100%,0)" }
    });
    useEffect(() => {
      set(true);

      return () => {
        set(false);
      };
    });
    return transitions.map(
      ({ item, key, props }) =>
        item && (
          <animated.div
            key={key}
            style={props}
            css={css`
              height: 100%;
            `}
          >
            {state({ ...parentProps })}
          </animated.div>
        )
    );
  };

  return (
    <>
      <Modal isOpen={state !== "close"} onRequestClose={handleClose}>
        {state !== "close" && (
          <Flex
            width={1}
            css={css`
               {
                height: 100%;
              }
            `}
          >
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
                    {CARD_TITLE}
                  </Heading>
                </Card>
              </FadeIn>
            </Box>

            <Box width={[1, 3 / 5]}>
              <Component
                {...(isThisAListItem(state)
                  ? { selectOption }
                  : { handleYes, handleNo })}
              />
            </Box>
          </Flex>
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
        <Text fontWeight="bold">{CARD_TITLE}</Text>
      </Card>
    </>
  );
}
