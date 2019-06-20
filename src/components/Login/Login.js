import React, { useState } from "react";
import { Button } from "@rebass/emotion";
import ASQ from "asynquence";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/functions";
import { Flex, Box, Text, Link } from "@rebass/emotion";
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
              Always be aware about the potential time you have to get work
              done.
            </Text>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold" mb={2} fontSize={3} color="gray.4">
              Spend time on things that matter
            </Text>
            <Text fontSize={2} color="gray.4">
              We help you to say no to unnecessary meetings and save time for
              you.
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

      <Flex width={["80vw", 300]} mx="auto" py={4} justifyContent="center">
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
