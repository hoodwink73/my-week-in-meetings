import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import firebase from "@firebase/app";
import "@firebase/firestore";
import "@firebase/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import { getUserGoogleID } from "../../utils";
import { DEFAULT_WORKING_TIME } from "../../constants";

export const UserConfigContext = createContext();

export default function UserConfig({ children }) {
  const { user } = useAuthState(firebase.auth());
  const googleUserID = getUserGoogleID(user);

  const userConfigDocRef = firebase.firestore().doc(`users/${googleUserID}`);
  const { error, loading, value } = useDocument(userConfigDocRef);

  const setUserConfigInFirestore = workingTime => {
    userConfigDocRef.set(
      {
        userConfig: { workingTime }
      },
      { merge: true }
    );
  };

  let userConfig;

  if (loading) {
    userConfig = null;
  } else if (!loading && error) {
    userConfig = null;
  } else if (!value.data().userConfig) {
    // this is useful unless the user change
    // the settings
    userConfig = DEFAULT_WORKING_TIME;
  } else {
    userConfig = value.data().userConfig.workingTime;
  }

  const userConfigStateAndHelpers = {
    userConfig,
    setUserConfig: setUserConfigInFirestore,
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
