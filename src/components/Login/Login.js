import React, { useState } from "react";
import { Button } from "@rebass/emotion";
import ASQ from "asynquence";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/functions";
import { Flex, Box, Text, Link } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import { CALENDAR_EVENTS_PERMISSION_SCOPE } from "../../constants";
import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";
import { ReactComponent as Logo } from "../../icons/logo.svg";
import { ReactComponent as GoogleLogo } from "../../icons/google-logo.svg";

// this is a simple sign in with google without wanting
// any offline access token
// this will suffice for all the other times after the user has *signed up*
// and provided the access token
const signInWithGoogle = () => {
  return ASQ().then(done => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then(
      function(googleUser) {
        const googleID = googleUser.getBasicProfile().getId();
        const idToken = googleUser.getAuthResponse().id_token;
        done({ googleID, idToken });
      },
      err => {
        done.fail(err);
      }
    );
  });
};

const hasUserProvidedEventsPermission = ({ googleID, idToken }) => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  return ASQ().val(() => {
    const currentUser = auth2.currentUser.get();
    if (currentUser.hasGrantedScopes(CALENDAR_EVENTS_PERMISSION_SCOPE)) {
      return { googleID, idToken };
    } else {
      throw new Error({
        internal_message: "USER_SCOPE_INADEQUATE"
      });
    }
  });
};

// offilne access token will allow us sync calendar events for the user
const getOfflineAccessToken = () => {
  if (
    !window.gapi ||
    !window.gapi.auth2 ||
    !window.gapi.auth2.getAuthInstance()
  ) {
    throw new Error({
      internal_message: "GOOGLE_AUTH_INSTANCE_NOT_READY"
    });
  }
  const auth2 = window.gapi.auth2.getAuthInstance();
  return ASQ()
    .promise(
      auth2.grantOfflineAccess({
        scope: CALENDAR_EVENTS_PERMISSION_SCOPE
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

  const handleSignUp = () => {
    setAuthenticationInProgress(true);
    return ASQ()
      .seq(getOfflineAccessToken, persistOfflineAccessToken)
      .val(({ data: idToken }) => ({ idToken }))
      .seq(signInWithFirebase)
      .or(error => {
        setAuthenticationInProgress(false);
        console.error(error);
      });
  };

  const handleSignIn = () => {
    // Sign the user in, and then retrieve their ID.
    setAuthenticationInProgress(true);
    return ASQ()
      .seq(signInWithGoogle)
      .seq(hasUserProvidedEventsPermission)
      .seq(signInWithFirebase)
      .or(error => {
        setAuthenticationInProgress(false);
        console.error(error);
      });
  };

  return (
    <Box bg="gray.0">
      <Flex
        width="100vw"
        style={{ height: "100%", minHeight: "100vh" }}
        flexDirection={["column", "row"]}
        justifyContent="center"
        alignItems="flex-start"
        pt={[4, 6]}
      >
        <Flex flexDirection="column" mx={["auto", 3]}>
          <Flex
            width={["80vw", 300]}
            mb={4}
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
              fontSize={[6]}
              css={css`
                position: absolute;
                top: calc(70%);
              `}
            >
              Deepwork Today
            </Text>
          </Flex>
          <Button
            bg={isAuthenticationInProgress ? "white.1" : "gray.4"}
            color={isAuthenticationInProgress ? "gray.4" : "white.1"}
            onClick={handleSignUp}
            style={{ cursor: "pointer" }}
            disabled={isAuthenticationInProgress}
          >
            <Flex justifyContent="center" alignItems="center" p={2}>
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
                  : "Sign Up With Google"}
              </Text>
            </Flex>
          </Button>
          <Text mt={3} textAlign="center">
            Already have an account?{" "}
            <Link
              css={css`
                cursor: pointer;
                text-decoration: underline;
              `}
              color="gray.4"
              onClick={handleSignIn}
            >
              Login
            </Link>
          </Text>
        </Flex>
        <Box width={["80vw", 300]} mx={["auto", 4]} my={[5, 0]}>
          <Box mb={5}>
            <Text fontWeight="bold" fontSize={[6]} color="gray.4">
              Time is finite. Spend it well, everyday.
            </Text>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold" mb={2} fontSize={3} color="gray.4">
              Seperate work and distractions
            </Text>
            <Text fontSize={2} color="gray.4">
              Always be aware about the potential time you have left to get work
              done.
            </Text>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold" mb={2} fontSize={3} color="gray.4">
              Spend time on things that matter
            </Text>
            <Text fontSize={2} color="gray.4">
              We help you say no to unnecessary meetings and save time.
            </Text>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold" mb={2} fontSize={3} color="gray.4">
              Collaboration thrives on agency
            </Text>
            <Text fontSize={2} color="gray.4">
              We provide tips to help you better organise and participate in
              meetings.
            </Text>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold" mb={2} fontSize={3} color="gray.4">
              The big picture
            </Text>
            <Text fontSize={2} color="gray.4">
              We summarise your collaborations. Know relative time spent between
              meetings and work. And much more.
            </Text>
          </Box>
        </Box>
      </Flex>

      <Flex width={["80vw", 300]} mx="auto" py={5} justifyContent="center">
        <Link fontSize={1} href="/privacy-policy" color="gray.4">
          Privacy Policy
        </Link>
        <Link fontSize={1} ml={2} href="/toc" color="gray.4">
          Terms And Conditions
        </Link>
      </Flex>
    </Box>
  );
}
