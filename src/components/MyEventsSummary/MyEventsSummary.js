import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { Button } from "@rebass/emotion";

export default function MyEventsSummary() {
  const { user } = useAuthState(firebase.auth());

  const [{ uid: googleID }] = user.providerData.filter(
    ({ providerId }) => providerId === "google.com"
  );

  const { error, loading, value } = useDocument(
    firebase.firestore().doc(`users/${googleID}/`)
  );

  let data = null;
  if (!loading && value.exists) {
    data = value.data();
  }

  const handleLogout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
    firebase.auth().signOut();
  };

  if (data) {
    return (
      <>
        <div>You are viewing the calendar for {data.calendar.summary}</div>
        <Button onClick={handleLogout}> Logout </Button>
      </>
    );
  } else {
    return null;
  }
}
