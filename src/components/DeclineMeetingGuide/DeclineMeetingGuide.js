import React, { useReducer, useState, useEffect, useRef } from "react";
import { Flex, Box, Text, Image, Card } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import firebase from "@firebase/app";
import "@firebase/functions";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import useMedia from "react-use/lib/useMedia";
import { useTransition, animated } from "react-spring";

import IntroImage from "../../images/decline-meeting-intro.png";
import AgendaUnClearImage from "../../images/decline-meeting-agenda-unclear.png";
import ResponsibilityImage from "../../images/decline-meeting-responsibility.png";
import NotWellInformedImage from "../../images/decline-meeting-not-well-informed.png";
import BusyImage from "../../images/decline-meeting-busy.png";
import AttendMeetingImage from "../../images/attend-meeting-alt.png";

import { FadeIn, SlideUp } from "../Animate";
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

const ANIMATION_CONFIG = {
  mass: 1.1,
  tension: 200
};

const declineMeetingGuideProgressChart = new Map([
  [Intro, [AgendaQuestion]],
  [AgendaQuestion, [AgendaResponse, ResponsibilityQuestion]],
  [ResponsibilityQuestion, [ResponsibilityResponse, NotWellInformedQuestion]],
  [NotWellInformedQuestion, [NotWellInformedResponse, BusyQuestion]],
  [BusyQuestion, [BusyResponse, AttendMeeting]]
]);

const IMAGES_FOR_STEP = new Map([
  [Intro, IntroImage],
  [AgendaQuestion, AgendaUnClearImage],
  [ResponsibilityQuestion, ResponsibilityImage],
  [NotWellInformedQuestion, NotWellInformedImage],
  [BusyQuestion, BusyImage],
  [AttendMeeting, AttendMeetingImage]
]);

const getComponentByName = componentName => {
  for (let [
    currentStep,
    possibleNextSteps
  ] of declineMeetingGuideProgressChart.entries()) {
    if (currentStep.name === componentName) {
      return currentStep;
    } else {
      for (let step of possibleNextSteps) {
        if (step.name === componentName) {
          return step;
        }
      }
    }
  }
};

const getPreviousStep = currentStep => {
  for (let [
    step,
    possibleNextSteps
  ] of declineMeetingGuideProgressChart.entries()) {
    if (possibleNextSteps.includes(currentStep)) {
      return step;
    }
  }
};

const Graphic = ({ currentStep }) => {
  const isLarge = useMedia("(min-width: 64em)");
  const [show, set] = useState(false);

  const shouldShowGraphic = () => !isResponseMode(currentStep);

  useEffect(
    () => {
      if (!shouldShowGraphic()) {
        set(false);
      } else {
        set(IMAGES_FOR_STEP.get(currentStep));
      }
    },
    [currentStep]
  );

  let transitions;

  const slideLeftTransitions = useTransition(show, null, {
    from: { transform: "translateX(100%)" },
    enter: { transform: "translateX(0%)" },
    leave: { transform: "translateX(-100%)" },
    config: ANIMATION_CONFIG
  });

  const slideUpTransitions = useTransition(show, null, {
    from: { transform: "translateY(100%)" },
    enter: { transform: "translateY(0%)" },
    leave: { transform: "translateY(-100%)" },
    config: ANIMATION_CONFIG
  });

  const opacityTransitions = useTransition(show, null, {
    from: { transform: "opacity: 0" },
    enter: { transform: "opacity: 1" },
    leave: { transform: "opacity: 0", transform: "translateX(-100%)" },
    config: ANIMATION_CONFIG
  });

  if (currentStep === Intro) {
    transitions = opacityTransitions;
  } else if (!shouldShowGraphic()) {
    transitions = slideUpTransitions;
  } else {
    transitions = slideLeftTransitions;
  }

  return (
    <Box
      css={css`
        position: relative;
        overflow: hidden;
      ${
        "" /*  54.9vw is mentioned to maintain aspect ratio of the image without it getting cut*/
      }
        height: ${!shouldShowGraphic() ? 0 : `${isLarge ? "366px" : "54.9vw"}`};
      `}
    >
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div
              key={key}
              style={props}
              css={css`
                position: absolute;
                top: 0;
                left: 0;
              `}
            >
              <Flex bg={Intro ? "primary.0" : "white"} justifyContent="center">
                {/* we need `alignSelf=start for Safari` otherwise it stretches
                 * it stretches the image
                 */}
                <Image width="auto" src={item} alignSelf="start" />
              </Flex>
            </animated.div>
          )
      )}
    </Box>
  );
};

const Animate = ({ currentStep, children }) => {
  const [show, set] = useState(false);
  const isLarge = useMedia("(min-width: 64em)");

  useEffect(
    () => {
      set(currentStep.name);
    },
    [currentStep]
  );

  const transitions = useTransition(show, null, {
    from: {
      position: "absolute",
      left: 0,
      right: 0,
      transform: "translateY(100%)"
    },
    enter: { transform: "translateY(0%)", opacity: 1 },
    leave: { opacity: 0 },
    config: ANIMATION_CONFIG,
    onRest: () => {
      const element = document.querySelector('[role="dialog"]');
      // when we switch from Intro to Questions or Responses
      // the height of the step significantly reduces, so we
      // animate the height of Modal while it reduces
      if (currentStep === Intro) {
        element.classList.add("animate-height");
      } else {
        element.classList.remove("animate-height");
      }
    }
  });

  const MAX_HEIGHT = `${isLarge ? 210 : 265}`;

  const INTRO_STEP_HEIGHT = `${MAX_HEIGHT}px`;

  const QUESTIONS_STEP_HEIGHT = `${MAX_HEIGHT - 80}px`;

  const HEIGHT =
    currentStep === Intro ? INTRO_STEP_HEIGHT : QUESTIONS_STEP_HEIGHT;

  return (
    <Box
      css={css`
        position: relative;
        width: 100%;
        height: ${HEIGHT};
      `}
    >
      {transitions.map(({ item, key, props }) => {
        let Component = getComponentByName(item);

        return (
          item && (
            <animated.div key={key} style={props}>
              <Component {...children.props} />
            </animated.div>
          )
        );
      })}
    </Box>
  );
};

const isResponseMode = Component => {
  const componentForResponseMode = [
    AgendaResponse,
    ResponsibilityResponse,
    NotWellInformedResponse,
    BusyResponse
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
  const isLarge = useMedia("(min-width: 64em)");

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

  const handleYes = () => {
    if (CurrentStep === AttendMeeting) {
      onRequestClose();
    } else {
      dispatch({ type: "yes" });
    }
  };

  let handleNo;

  if (CurrentStep === Intro) {
    handleNo = onRequestClose;
  } else {
    handleNo = () => dispatch({ type: "no" });
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentFit>
      <Box
        width={["calc(90vw)", 600]}
        css={css`
          height: 100%;
          overflow: hidden;
        `}
      >
        <Graphic currentStep={CurrentStep} />
        {isResponseMode(CurrentStep) ? (
          <SlideUp config={ANIMATION_CONFIG}>
            <Card
              width={9 / 10}
              mx="auto"
              my={3}
              bg="primary.0"
              borderRadius={10}
            >
              <Event data={event} readOnly />
            </Card>

            <CurrentStep onDeclineResponse={handleDeclineResponse} />
          </SlideUp>
        ) : (
          <>
            <Box width={8 / 10} mx="auto">
              <Text fontSize={2} fontWeight="bold" mx="auto" my={3}>
                Learn how to say no to meetings politely
              </Text>

              <Animate currentStep={CurrentStep}>
                <CurrentStep handleYes={handleYes} handleNo={handleNo} />
              </Animate>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
}

export default DeclineMeetingGuide;
