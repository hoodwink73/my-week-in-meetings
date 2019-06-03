import React, { useReducer } from "react";
import { Flex, Box, Text, Image, Card } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import firebase from "@firebase/app";
import "@firebase/functions";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import TipsGuideImage from "../../images/image-placeholder.jpg";
import Modal from "../Modal";
import { Event } from "../Events";
import { getUserGoogleID } from "../../utils";

import Intro from "./Intro";

import AgendaQuestion from "./AgendaQuestion";
import AgendaResponse from "./AgendaResponse";

import ResponsibilityQuestion from "./ResponsibilityQuestion";
import ResponsibilityResponse from "./ResponsibilityResponse";

import NotWellInformedQuestion from "./NotWellInformedQuestion";
import NotWellInformedResponse from "./NotWellInformedResponse";

import BusyQuestion from "./BusyQuestion";
import BusyResponse from "./BusyResponse";

import AttendMeeting from "./AttendMeeting";

const Graphic = () => (
  <Image
    width={1}
    src={TipsGuideImage}
    css={css`
      height: 278px;
    `}
  />
);

const DeclineTheMeetingHeader = () => {
  return (
    <Card bg="primary.2" px={3} pt={2} pb={3}>
      <Text fontSize={2} fontWeight="bold">
        Decline This Meeting
      </Text>
    </Card>
  );
};

const declineMeetingGuideProgressChart = new Map([
  [Intro, [AgendaQuestion]],
  [AgendaQuestion, [AgendaResponse, ResponsibilityQuestion]],
  [ResponsibilityQuestion, [ResponsibilityResponse, NotWellInformedQuestion]],
  [NotWellInformedQuestion, [NotWellInformedResponse, BusyQuestion]],
  [BusyQuestion, [BusyResponse, AttendMeeting]]
]);

const isResponseMode = Component => {
  const componentForResponseMode = [
    AgendaResponse,
    ResponsibilityResponse,
    NotWellInformedResponse,
    BusyResponse,
    AttendMeeting
  ];
  return componentForResponseMode.includes(Component);
};

const reducer = (state, action) => {
  switch (action.type) {
    case "yes":
      if (declineMeetingGuideProgressChart.has(state)) {
        return declineMeetingGuideProgressChart.get(state)[0];
      } else {
        return state;
      }
    case "no":
      if (declineMeetingGuideProgressChart.has(state)) {
        return declineMeetingGuideProgressChart.get(state)[1];
      } else {
        return state;
      }
    case "select":
      if (declineMeetingGuideProgressChart.has(state)) {
        return declineMeetingGuideProgressChart.get(state)[action.index];
      } else {
        return state;
      }

    default:
      return state;
  }
};

function DeclineMeetingGuide({ event, isOpen, onRequestClose }) {
  const [CurrentStep, dispatch] = useReducer(reducer, Intro);
  const { user } = useAuthState(firebase.auth());

  const declineEventCloudFn = firebase
    .functions()
    .httpsCallable("declineEvent");

  const handleDeclineResponse = async comment => {
    const googleUserID = getUserGoogleID(user);

    const declineEventResponse = await declineEventCloudFn({
      userID: googleUserID,
      eventID: event.id,
      comment
    });

    onRequestClose();

    return declineEventResponse;
  };

  const handleYes = () => dispatch({ type: "yes" });

  let handleNo;

  if (CurrentStep === Intro) {
    handleNo = onRequestClose;
  } else {
    handleNo = () => dispatch({ type: "no" });
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentFit>
      <Box width={["calc(90vw)", 600]}>
        {isResponseMode(CurrentStep) ? (
          <>
            <DeclineTheMeetingHeader />
            <Card
              width={9 / 10}
              mx="auto"
              my={3}
              bg="primary.0"
              borderRadius={10}
            >
              <Event data={event} readOnly />
            </Card>

            <CurrentStep
              handleYes={handleYes}
              handleNo={handleNo}
              onDeclineResponse={handleDeclineResponse}
            />
          </>
        ) : (
          <>
            <Graphic />
            <Box>
              <Text
                width={9 / 10}
                fontSize={2}
                fontWeight="bold"
                mx="auto"
                my={2}
              >
                Learn how to say no to meetings politely
              </Text>
              <CurrentStep handleYes={handleYes} handleNo={handleNo} />
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default DeclineMeetingGuide;
