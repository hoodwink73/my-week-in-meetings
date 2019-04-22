import React, { useState, useEffect } from "react";
import { ThemeProvider } from "emotion-theming";
import { Helmet } from "react-helmet";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";

import theme from "./theme";
import Login from "./components/Login";
import MyEventsSummary from "./components/MyEventsSummary";
import GlobalStyles from "./components/GlobalStyles";

const GOOGLE_SIGN_IN_OAUTH_SCOPE =
  "profile email openid https://www.googleapis.com/auth/calendar";

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
          {initialisingUser && hasGoogleSignInScriptLoaded ? (
            "Loading"
          ) : user ? (
            <MyEventsSummary />
          ) : (
            <Login />
          )}
        </div>
      </ThemeProvider>

      {!hasGoogleSignInScriptLoaded && (
        <Helmet>
          <script
            src="https://apis.google.com/js/client:platform.js?onload=onGoogleSignInScriptLoad"
            async
            defer
          />
        </Helmet>
      )}
    </>
  );
}

export default App;
