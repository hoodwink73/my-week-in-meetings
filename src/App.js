import React, { useState, useEffect, memo } from "react";
import { Flex, Box } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Helmet } from "react-helmet";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "@firebase/app";
import "@firebase/auth";
import useMedia from "react-use/lib/useMedia";

import theme from "./theme";
import Login from "./components/Login";
import { Errors, ErrorManagerContextProvider } from "./components/Errors";
import NewUserForm from "./components/NewUserForm";
import MyEventsSummary from "./components/MyEventsSummary";
import GlobalStyles from "./components/GlobalStyles";
import FirestoreData from "./components/FirestoreData";
import UserConfig from "./components/UserConfig";
import { getUserGoogleID } from "./utils";
import { ReactComponent as LoadingIcon } from "./icons/icon-refresh.svg";

const GOOGLE_SIGN_IN_OAUTH_SCOPE = "profile email openid";

// we do not want our script tag to be re-rendered
// hence we memo this
const GoogleSignInScript = memo(() => (
  <Helmet>
    <script
      src={`https://apis.google.com/js/client:platform.js?onload=onGoogleSignInScriptLoad&time=${Date.now()}`}
      async
      defer
    />
  </Helmet>
));

function App() {
  const [hasGoogleSignInScriptLoaded, setGoogleSignInScriptToLoaded] = useState(
    false
  );

  const { initialising: initialisingUser, user } = useAuthState(
    firebase.auth()
  );

  const isLarge = useMedia("(min-width: 64em)");

  useEffect(() => {
    const handleGoogleSignInScriptLoad = function() {
      window.gapi.load("auth2", function() {
        window.gapi.auth2.init({
          client_id: process.env.REACT_APP_GOOGLE_OAUTH_APP_CLIENT_ID,
          scope: GOOGLE_SIGN_IN_OAUTH_SCOPE
        });

        setGoogleSignInScriptToLoaded(true);
      });
    };

    window.onGoogleSignInScriptLoad = handleGoogleSignInScriptLoad;
  }, []);

  useEffect(() => {
    if (user && window.ga) {
      // set the google id as an unqiue id to track events for the
      // user on
      window.ga("set", "userId", user.providerData[0].uid);
      window.ga("send", "event", "authentication", "user-id available");
    }
  }, [user]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <ErrorManagerContextProvider>
          <div className="App">
            <GlobalStyles />
            {initialisingUser && (
              <Flex
                justifyContent="center"
                alignItems="center"
                css={css`
                  height: 100vh;
                `}
              >
                <Box width={64} pt={1} mr={2}>
                  <LoadingIcon />
                </Box>
              </Flex>
            )}

            {user ? (
              <FirestoreData googleID={getUserGoogleID(user)}>
                <UserConfig>
                  <NewUserForm />
                  <MyEventsSummary />
                </UserConfig>
              </FirestoreData>
            ) : (
              !initialisingUser && <Login />
            )}
          </div>

          <Errors />
        </ErrorManagerContextProvider>
      </ThemeProvider>
      {/* we are appending the current time stamp to script source to burst cache.
          iOS Safari is not executing the google sign in script onLoad handler
          if the script is loaded from disk cache
          this breaks subsequent sign in and sign out experience
          as the google auth was never initialized
        */}
      {!hasGoogleSignInScriptLoaded && <GoogleSignInScript />}

      {/* React Portal to render errors */}
      <div
        style={{
          position: "fixed",
          left: "20px",
          bottom: "20px",
          ...(!isLarge && {
            right: "20px"
          })
        }}
        id="errors-container"
      />
    </>
  );
}

export default App;
