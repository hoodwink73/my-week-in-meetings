import React, { Component } from "react";
import { ThemeProvider } from "emotion-theming";
import { Box } from "@rebass/emotion";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";

import theme from "./theme";
import Login from "./components/Login";
import MyEventsSummary from "./components/MyEventsSummary";

function App() {
  const { initialising: initialisingUser, user } = useAuthState(
    firebase.auth()
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        {initialisingUser ? "Loading" : user ? <MyEventsSummary /> : <Login />}
      </div>
    </ThemeProvider>
  );
}

export default App;
