import React, { useContext, useReducer, useRef } from "react";
import Modal from "../Modal";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Box, Text } from "@rebass/emotion";
import { useTransition, animated } from "react-spring";

import Illustration from "./Illustration";
import GetUserDetailsForm from "./GetUserDetailsForm";
import GetDailySchedule from "./GetDailySchedule";
import { UserConfigContext } from "../UserConfig";
import { useUser } from "../../hooks";
import { useErrorManager } from "../Errors";

const reducer = (state, action) => {
  switch (action.type) {
    case "NEXT":
      return "CONFIGURE_DAILY_SCHEDULE";
    case "CLOSE":
      return "DONE";
    default:
      return state;
  }
};

const ANIMATION_CONFIG = {
  mass: 1.1,
  tension: 100
};

export default function NewUserForm() {
  const {
    userDetails,
    setUserDetails,
    setUserConfig,
    userConfigRequest
  } = useContext(UserConfigContext);
  const [step, dispatch] = useReducer(reducer, "INITIAL");
  const { user } = useUser();
  const { registerError } = useErrorManager();

  const isModalOpen = !userDetails;
  const [assumedFirstName] = user.displayName.split(" ");

  const transitions = useTransition(step === "INITIAL", null, {
    leave: { transform: "translateX(-10%)", opacity: 0 },
    config: ANIMATION_CONFIG
  });

  // this is the value of the first form - GetUserDetails
  // we save the output of the two forms together
  // since saving the first form would update the `userDetails`
  // which is used as a signal to show the modal to new users
  const cache = useRef(null);

  const cacheData = value => {
    cache.current = value;
  };

  const isLarge = useMedia("(min-width: 64em)");

  return (
    <Modal isOpen={isModalOpen} doNotAllowToClose contentFit={isLarge}>
      <Flex
        width={[1, 600]}
        flexDirection={["column"]}
        css={css`
          height: 540px;
        `}
      >
        <Illustration width={[1]} p={4} />

        <Box px={4} pt={4}>
          <Text fontWeight="bold" fontSize={3}>
            Hello, {assumedFirstName}!
          </Text>

          <Text mt={2} fontSize={1}>
            {step === "INITIAL"
              ? "Tell us about yourself"
              : "Tell us about your daily schedule"}
          </Text>
        </Box>

        <Box
          css={css`
            position: relative;
          `}
        >
          {transitions.map(({ item, key, props }) => {
            return (
              <animated.div
                style={props}
                key={key}
                css={css`
                  position: absolute;
                `}
              >
                {item && (
                  <GetUserDetailsForm
                    width={[1, 600]}
                    p={4}
                    onFormSubmit={values => {
                      cacheData({ userDetails: values });
                      dispatch({
                        type: "NEXT"
                      });
                    }}
                  />
                )}
              </animated.div>
            );
          })}
          <Box
            css={css`
              position: absolute;
            `}
          />
          {step === "CONFIGURE_DAILY_SCHEDULE" && (
            <GetDailySchedule
              width={[1, 600]}
              p={4}
              onFormSubmit={async values => {
                try {
                  await setUserDetails(cache.current.userDetails);
                  await setUserConfig(values);

                  dispatch({
                    type: "CLOSE"
                  });
                } catch (e) {
                  registerError({
                    message:
                      "Sorry, We couldn't save your information this time."
                  });
                  console.error(e);
                }
              }}
            />
          )}
        </Box>
      </Flex>
    </Modal>
  );
}
