import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";
import moment from "moment";
import * as serviceWorker from "./serviceWorker";

import "./index.css";
import App from "./App";

import IntroImage from "./images/decline-meeting-intro.png";
import AgendaUnclearImage from "./images/decline-meeting-agenda-unclear.png";
import ResponsibilityImage from "./images/decline-meeting-responsibility.png";
import NotWellInformedImage from "./images/decline-meeting-not-well-informed.png";
import BusyImage from "./images/decline-meeting-busy.png";
import AttendMeetingImage from "./images/attend-meeting-alt.png";

// import * as MockDate from "mockdate";
// MockDate.set("2019-07-05T08:00:00");

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

(function preloadImages() {
  const imagesToPreload = [
    IntroImage,
    AgendaUnclearImage,
    ResponsibilityImage,
    NotWellInformedImage,
    BusyImage,
    AttendMeetingImage
  ];

  for (let imageUrl of imagesToPreload) {
    const img = new Image();
    img.src = imageUrl;
  }
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
