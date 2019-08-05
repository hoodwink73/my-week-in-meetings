import { useEffect } from "react";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { getUserGoogleID, track } from "../utils";

export default function(userProperties, doStopUpdatingUser) {
  const { user } = useAuthState(firebase.auth());

  const userID = getUserGoogleID(user);

  useEffect(() => {
    if (!userID) {
      return;
    }

    const userDocRef = firebase.firestore().doc(`users/${userID}/`);
    userDocRef.get().then(docSnapshot => {
      if (docSnapshot.exists) {
        const userData = docSnapshot.data();
        if (!userData.userProfileUpdatedInMixpanel) {
          track.updateUserProfileInMixpanel(userProperties);
          if (doStopUpdatingUser) {
            userDocRef.set(
              { userProfileUpdatedInMixpanel: true },
              { merge: true }
            );
          }
        }
      }
    });
  }, [userID]);
}
