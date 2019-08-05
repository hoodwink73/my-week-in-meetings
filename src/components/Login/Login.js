import React, { useState } from "react";
import { Button } from "@rebass/emotion";
import ASQ from "asynquence";
import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/functions";
import { Flex, Box, Text, Card, Link } from "@rebass/emotion";
import { Link as RouteLink, Route } from "react-router-dom";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";

import FAQ from "../FAQ";
import About from "../About";
import Logo from "../Logo";
import Nav from "../Nav";
import { useErrorManager } from "../Errors";
import {
  CALENDAR_EVENTS_PERMISSION_SCOPE,
  GOOGLE_SIGN_IN_ERRORS
} from "../../constants";
import { AppError } from "../../utils";
import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";
import { ReactComponent as GoogleLogoNormal } from "../../icons/btn_google_light_normal_ios.svg";
import { ReactComponent as GoogleLogoDisabled } from "../../icons/btn_google_dark_disabled.svg";

import bigBlobInBackground from "../../images/big-blob.svg";
import smallBlobInBackground from "../../images/small-blob.svg";
import heroImage from "../../images/hero-image.png";

import Features from "./Features";
import "./Login.css";

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
        if (err.error && err.error === "popup_closed_by_user") {
          done.fail(new AppError("USER_SUSPENDED_GOOGLE_SIGN_IN_POPUP"));
        } else {
          done.fail(err);
        }
      }
    );
  });
};

const hasUserProvidedEventsPermission = authDetails => {
  const auth2 = window.gapi.auth2.getAuthInstance();
  let error = "USER_SCOPE_INADEQUATE";
  // if this sequence is used in the sign up sequence
  // we need to change the error message
  // litmus test for a sign up sequence is that the auth details
  // will have `authorizationCode`
  // while auth details passed forwarded by sign in sequence will not
  if (authDetails.authorizationCode) {
    error = "USER_DENIED_PERMISSION";
  }

  return ASQ().val(() => {
    const currentUser = auth2.currentUser.get();
    if (currentUser.hasGrantedScopes(CALENDAR_EVENTS_PERMISSION_SCOPE)) {
      return authDetails;
    } else {
      throw new AppError(error);
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
    throw new AppError("GOOGLE_AUTH_INSTANCE_NOT_READY");
  }

  const auth2 = window.gapi.auth2.getAuthInstance();
  return ASQ()
    .promise(
      auth2
        .grantOfflineAccess({
          scope: CALENDAR_EVENTS_PERMISSION_SCOPE
        })
        .catch(() => {
          throw new AppError("USER_DENIED_PERMISSION");
        })
    )
    .then((done, { code }) => {
      if (!code) {
        done.fail(new AppError("USER_DENIED_PERMISSION"));
      }
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

const DEFAULT_FONT_FAMILY = `
-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
`;

export default function Login() {
  const [isAuthenticationInProgress, setAuthenticationInProgress] = useState(
    false
  );

  const { registerError } = useErrorManager();

  const isLarge = useMedia("(min-width: 64em)");
  const isSmall = useMedia("(max-width: 40em )");

  const isTablet = useMedia("(min-width: 48em)");
  const isLargeDesktop = useMedia("(min-width: 90em)");

  const handleSignUp = () => {
    const setAuthenticationProgress = authDetails =>
      ASQ().val(() => {
        setAuthenticationInProgress(true);
        return authDetails;
      });

    return ASQ()
      .seq(
        getOfflineAccessToken,
        hasUserProvidedEventsPermission,
        setAuthenticationProgress,
        persistOfflineAccessToken
      )
      .val(({ data: idToken }) => ({ idToken }))
      .seq(signInWithFirebase)
      .val(() => {
        if (window.ga) {
          window.ga("send", "event", "authentication", "new user");
        }
      })
      .or(error => {
        setAuthenticationInProgress(false);
        if (error instanceof AppError) {
          registerError({
            message: error.message
          });
        }

        console.error(error);
      });
  };

  const handleSignIn = () => {
    return ASQ()
      .seq(signInWithGoogle)
      .seq(hasUserProvidedEventsPermission)
      .val(googleAccountDetails => {
        // Sign the user in, and then retrieve their ID.
        setAuthenticationInProgress(true);
        return googleAccountDetails;
      })
      .seq(signInWithFirebase)
      .or(error => {
        setAuthenticationInProgress(false);

        if (error instanceof AppError) {
          registerError({
            message: error.message
          });
        }

        console.error(error);
      });
  };

  const SignUpButton = props => {
    return (
      <Box {...props}>
        <Button
          width={[1]}
          bg={isAuthenticationInProgress ? "googleButton.2" : "white.0"}
          color="gray.4"
          onClick={handleSignUp}
          style={{ cursor: "pointer" }}
          disabled={isAuthenticationInProgress}
          px={1}
          py={1}
          borderderRadius={1}
          alignSelf="center"
          css={({ colors }) => css`
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
          `}
        >
          <Flex justifyContent="center">
            {isAuthenticationInProgress && (
              <Box bg="transparent" pt={1}>
                <GoogleLogoDisabled />
              </Box>
            )}

            {!isAuthenticationInProgress && (
              <Box bg="white.0" pt={1}>
                <GoogleLogoNormal />
              </Box>
            )}
            <Flex>
              {isAuthenticationInProgress && (
                <Box width={24} alignSelf="center">
                  <LoadingIcon />
                </Box>
              )}
              <Text
                alignSelf="center"
                css={css`
                  font-family: "Roboto", sans-serif;
                  font-size: ${isLarge ? "18px" : "14px"};
                `}
              >
                Sign Up With Google
              </Text>
            </Flex>
          </Flex>
        </Button>
        <Text mt={3} textAlign={["center", "left"]}>
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
      </Box>
    );
  };

  const Authenticating = () => (
    <Flex
      justifyContent="center"
      alignItems="center"
      css={css`
        height: 100vh;
      `}
    >
      <Box width={64} pt={1} mr={2} flex="0 0 auto">
        <LoadingIcon />
      </Box>
    </Flex>
  );

  if (isAuthenticationInProgress) {
    return <Authenticating />;
  } else {
    return (
      <>
        <Route path="/" exact>
          {({ match }) => {
            return (
              match && (
                <>
                  <Box
                    css={css`
                      width: 100vw;
                      height: ${isSmall ? "auto" : "80vh"};
                    `}
                  >
                    <Flex
                      flexDirection={["column", "row", "row"]}
                      mb={5}
                      css={css`
                        position: relative;
                        height: ${isSmall ? "auto" : "100%"};
                      `}
                    >
                      <Box
                        width={[1, 0.5]}
                        order={[2, 1, 1]}
                        css={css`
                          height: ${isLarge ? "120%" : "auto"};
                        `}
                      >
                        <Flex
                          justifyContent="flex-end"
                          alignItems="center"
                          css={css`
                    position: ${isLarge ? "relative" : "static"};
                  ${
                    "" /* adjust to keep distance from the absolutely positioned logo */
                  }
                    height: 100%;
                    align-items: center;
                    background-image: url(${smallBlobInBackground});
                    background-repeat: no-repeat;
                    background-position: left top;
                    background-size: 100%;
                    background-blend-mode: lighten;

                    ${isTablet &&
                      css`
                        padding-left: 32px;
                      `}

                    ${isLarge &&
                      css`
                        padding-left: 64px;
                      `}

                    ${isLargeDesktop &&
                      css`
                        padding-left: 132px;
                        width: 80%;
                      `}
                  `}
                        >
                          <Logo />
                          <Box width={[1]} px={[4, 0]}>
                            <Text
                              mt={[0, 4]}
                              fontSize={[6, 7]}
                              fontWeight={900}
                              textAlign={["center", "left"]}
                              css={css`
                                font-family: Quicksand, ${DEFAULT_FONT_FAMILY};
                              `}
                            >
                              <Text>Keep a tab </Text>
                              <Text>on your day</Text>
                            </Text>
                            <Text
                              fontSize={[3, 4]}
                              mt={[4]}
                              lineHeight={2}
                              textAlign={["center", "left"]}
                              css={css`
                                font-family: Montserrat, ${DEFAULT_FONT_FAMILY};
                              `}
                            >
                              Worried that your time is lost in unproductive
                              meetings — use our deepwork clock and interactive
                              bite-sized guide to free up more time.
                            </Text>
                            <SignUpButton
                              width={[0.7]}
                              mt={4}
                              mx={["auto", 0]}
                            />
                          </Box>
                        </Flex>
                      </Box>
                      <Flex
                        width={[1, 0.5]}
                        order={[1, 2, 2]}
                        justifyContent="flex-end"
                        css={css`
                          height: ${isSmall ? "45vh" : "100%"};
                          background-image: url(${heroImage}),
                            url(${bigBlobInBackground});
                          background-repeat: no-repeat;
                          background-position: center center,
                            left
                              ${isSmall
                                ? "100%"
                                : isLargeDesktop
                                ? "100%"
                                : "50%"};
                          background-size: 80%, 130%;
                          flex-shrink: 0;
                          background-blend-mode: luminosity;
                        `}
                      >
                        <Nav />
                      </Flex>
                    </Flex>
                  </Box>
                  <Features width={[4 / 5, 3 / 4]} mx="auto" my={4} />

                  <Flex
                    width={["80vw", 300]}
                    mx="auto"
                    my={5}
                    justifyContent="center"
                  >
                    <Link fontSize={1} href="/privacy-policy" color="gray.4">
                      Privacy Policy
                    </Link>
                    <Link fontSize={1} ml={2} href="/toc" color="gray.4">
                      Terms And Conditions
                    </Link>
                  </Flex>
                  {/* hack to prevent margin collapse in Safari */}
                  <Box p={1} />
                </>
              )
            );
          }}
        </Route>
        <Route
          path="/about"
          exact
          render={routeProps => {
            return <About {...routeProps} />;
          }}
        />
      </>
    );
  }
}
