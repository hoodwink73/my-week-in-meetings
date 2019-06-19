import React, { useState } from "react";
import { Button } from "@rebass/emotion";
import ASQ from "asynquence";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/functions";
import { Flex, Box, Text } from "@rebass/emotion";
import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";
import { ReactComponent as Logo } from "../../icons/logo.svg";
import { ReactComponent as GoogleLogo } from "../../icons/google-logo.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const CALENDAR_EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events";

// this is a simple sign in with google without wanting
// any offline access token
// this will suffice for all the other times after the user has *signed up*
// and provided the access token
const signInWithGoogle = setLoaderStatus => {
  return ASQ().then(done => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    setLoaderStatus(true);
    auth2.signIn().then(function(googleUser) {
      const googleID = googleUser.getBasicProfile().getId();
      const idToken = googleUser.getAuthResponse().id_token;
      done({ googleID, idToken });
    });
  });
};

const hasUserProvidedEventsPermission = () => {
  const currentUser = window.gapi.auth2.getAuthInstance().currentUser.get();
  return currentUser && currentUser.hasGrantedScopes(CALENDAR_EVENTS_SCOPE);
};

// offilne access token will allow us sync calendar events for the user
const getOfflineAccessToken = () => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  return ASQ()
    .promise(
      auth2.currentUser.get().grantOfflineAccess({
        scope: CALENDAR_EVENTS_SCOPE
      })
    )
    .then((done, { code }) => {
      auth2.currentUser.listen(user => {
        done({
          authorizationCode: code,
          googleID: user.getId()
        });
      });
    });
};

const signInWithFirebase = ({ idToken }) => {
  const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

  return ASQ().promise(
    firebase.auth().signInAndRetrieveDataWithCredential(credential)
  );
};

const persistOfflineAccessToken = ({ authorizationCode, googleID }) => {
  const googleCloudFn = firebase
    .functions()
    .httpsCallable("getAndStoreOfflineAccessToken");

  return ASQ().promise(googleCloudFn({ code: authorizationCode, googleID }));
};

export default function Login() {
  const [isAuthenticationInProgress, setAuthenticationInProgress] = useState(
    false
  );

  const handleSignIn = () => {
    // Sign the user in, and then retrieve their ID.
    ASQ()
      .then(done => {
        let googleID, idToken;

        ASQ().seq(
          signInWithGoogle(setAuthenticationInProgress),
          userDetails => {
            googleID = userDetails.googleID;
            idToken = userDetails.idToken;

            return ASQ().val(() => {
              const hasCalendarEventsPermission = hasUserProvidedEventsPermission();
              done({
                googleID,
                idToken,
                hasCalendarEventsPermission
              });
            });
          }
        );
      })
      .then((done, { idToken, hasCalendarEventsPermission }) => {
        if (!hasCalendarEventsPermission) {
          ASQ()
            .seq(getOfflineAccessToken, persistOfflineAccessToken)
            .val(({ data: idToken }) => done({ idToken }));
        } else {
          done({ idToken });
        }
      })
      .seq(signInWithFirebase)
      .or(error => {
        setAuthenticationInProgress(false);
        console.error(error);
      });
  };

  return (
    <Flex
      width="100vw"
      style={{ height: "100vh" }}
      bg="gray.0"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexDirection="column">
        <Flex
          width={["60vw", 300]}
          mb={5}
          alignSelf="center"
          flexWrap="wrap"
          css={css`
            position: relative;
          `}
        >
          <Box width={1}>
            <Logo />
          </Box>
          <Text
            width={1 / 2}
            color="gray.4"
            fontWeight="bold"
            fontSize={[5, 6]}
            css={css`
              position: absolute;
              top: calc(40%);
            `}
          >
            My week in meetings
          </Text>
        </Flex>
        <Button
          bg={isAuthenticationInProgress ? "white.1" : "gray.4"}
          color={isAuthenticationInProgress ? "gray.4" : "white.1"}
          onClick={handleSignIn}
          style={{ cursor: "pointer" }}
          disabled={isAuthenticationInProgress}
        >
          <Flex justifyContent="center" alignItems="center" p={3}>
            {isAuthenticationInProgress && (
              <Box width={24} pt={1} mr={2}>
                <LoadingIcon />
              </Box>
            )}

            <Box width={18} mr={2}>
              <GoogleLogo />
            </Box>
            <Text alignSelf="flex-start">
              {isAuthenticationInProgress
                ? "Signing In"
                : "Sign In With Google"}
            </Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  );
}
