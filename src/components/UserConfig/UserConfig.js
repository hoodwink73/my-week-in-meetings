import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { getUserGoogleID } from "../../utils";
// there is a default working time constant inside the firebase app too
// both of these need to be in sync
import { DEFAULT_WORKING_TIME } from "../../constants";

export const UserConfigContext = createContext();

export default function UserConfig({ children }) {
  const { user } = useAuthState(firebase.auth());
  const googleUserID = getUserGoogleID(user);

  const userDocRef = firebase.firestore().doc(`users/${googleUserID}`);
  const { error, loading, value } = useDocument(userDocRef);

  const setUserConfigInFirestore = workingTime => {
    return userDocRef.set(
      {
        userConfig: { workingTime }
      },
      { merge: true }
    );
  };

  const setUserDetailsInFirestore = userDetails => {
    return userDocRef.set(
      {
        userDetails: { ...userDetails }
      },
      { merge: true }
    );
  };

  let userConfig, userDetails;

  const resolvedToError = !loading && error;
  const dataNotReadyYet = !(value && value.exists);

  if (loading || resolvedToError || dataNotReadyYet) {
    userConfig = DEFAULT_WORKING_TIME;
  } else {
    userConfig = value.data().userConfig.workingTime;
    userDetails = value.data().userDetails;
  }

  const userConfigStateAndHelpers = {
    userConfig,
    userDetails,
    setUserConfig: setUserConfigInFirestore,
    setUserDetails: setUserDetailsInFirestore,
    userConfigRequest: { error, loading }
  };

  return (
    <UserConfigContext.Provider value={userConfigStateAndHelpers}>
      {children}
    </UserConfigContext.Provider>
  );
}

UserConfig.propTypes = {
  children: PropTypes.node.isRequired
};
