import React, { useContext, useReducer, useRef } from "react";
import Modal from "../Modal";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Box, Text } from "@rebass/emotion";
import { useTransition, animated } from "react-spring";
import useMedia from "react-use/lib/useMedia";

import Illustration from "./Illustration";
import GetUserDetailsForm from "./GetUserDetailsForm";
import GetDailySchedule from "./GetDailySchedule";
import { UserConfigContext } from "../UserConfig";
import { useUser } from "../../hooks";
import { useErrorManager } from "../Errors";
import { track, getUserGoogleID, getUserEmail } from "../../utils";

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
  mass: 6,
  tension: 50
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
    from: { position: "absolute", opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
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

  if (userConfigRequest.loading) {
    return null;
  } else {
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

            {transitions.map(({ item, key, props }) => (
              <animated.div key={key} style={props}>
                {item ? (
                  <Text mt={2} fontSize={1}>
                    Tell us about yourself
                  </Text>
                ) : (
                  <Text mt={2} fontSize={1}>
                    Tell us about your daily schedule
                  </Text>
                )}
              </animated.div>
            ))}
          </Box>

          {step === "INITIAL" && (
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
          {step === "CONFIGURE_DAILY_SCHEDULE" && (
            <GetDailySchedule
              width={[1, 600]}
              p={4}
              onFormSubmit={async values => {
                try {
                  await setUserDetails(cache.current.userDetails);
                  await setUserConfig({
                    workingTime: { ...values }
                  });

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

                const { role, firstName, lastName } = cache.current.userDetails;

                track.createUserProfileInMixpanel({
                  userID: getUserGoogleID(user),
                  email: getUserEmail(user),
                  role: role,
                  firstName,
                  lastName
                });
              }}
            />
          )}
        </Flex>
      </Modal>
    );
  }
}
