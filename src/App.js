import React, { useState, useEffect } from "react";
import { Flex, Box } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { ThemeProvider } from "emotion-theming";
import { Helmet } from "react-helmet";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "@firebase/app";
import "@firebase/auth";

import theme from "./theme";
import Login from "./components/Login";
import MyEventsSummary from "./components/MyEventsSummary";
import GlobalStyles from "./components/GlobalStyles";
import FirestoreData from "./components/FirestoreData";
import UserConfig from "./components/UserConfig";
import { getUserGoogleID } from "./utils";
import { ReactComponent as LoadingIcon } from "./icons/icon-refresh.svg";

const GOOGLE_SIGN_IN_OAUTH_SCOPE = "profile email openid";

function App() {
  const [hasGoogleSignInScriptLoaded, setGoogleSignInScriptToLoaded] = useState(
    false
  );

  const { initialising: initialisingUser, user } = useAuthState(
    firebase.auth()
  );

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

  return (
    <>
      <ThemeProvider theme={theme}>
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
                <MyEventsSummary />
              </UserConfig>
            </FirestoreData>
          ) : (
            !initialisingUser && <Login />
          )}
        </div>
      </ThemeProvider>
      {/* we are appending the current time stamp to script source to burst cache.
          iOS Safari is not executing the google sign in script onLoad handler
          if the script is loaded from disk cache
          this breaks subsequent sign in and sign out experience
          as the google auth was never initialized
        */}
      {!hasGoogleSignInScriptLoaded && (
        <Helmet>
          <script
            src={`https://apis.google.com/js/client:platform.js?onload=onGoogleSignInScriptLoad&time=${Date.now()}`}
            async
            defer
          />
        </Helmet>
      )}
    </>
  );
}

export default App;
