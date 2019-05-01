import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import moment from "moment";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import App from "./App";

import * as MockDate from "mockdate";
MockDate.set("2019-04-01T09:00");

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_PROJECT_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_PROJECT_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_PROJECT_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_MESSAGING_SENDER_ID
};

firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
