import React from "react";
import { Button } from "@rebass/emotion";
import ASQ from "asynquence";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import { Flex, Box } from "@rebass/emotion";

export default function Login() {
  const handleSignIn = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();

    const persistOfflineAccessToken = ({ authorizationCode, googleID }) => {
      const googleCloudFn = firebase
        .functions()
        .httpsCallable("getAndStoreOfflineAccessToken");

      return ASQ().promise(
        googleCloudFn({ code: authorizationCode, googleID })
      );
    };

    const signInWithFirebase = ({ idToken }) => {
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);

      return ASQ().promise(
        firebase.auth().signInAndRetrieveDataWithCredential(credential)
      );
    };

    ASQ()
      .promise(auth2.grantOfflineAccess())
      .val(({ code }) => ({
        authorizationCode: code,
        googleID: auth2.currentUser.get().getId()
      }))
      .seq(persistOfflineAccessToken)
      .val(({ data: idToken }) => ({ idToken }))
      .seq(signInWithFirebase)
      .or(error => {
        console.error(error);
      });
  };

  return (
    <Flex
      width="100vw"
      style={{ height: "100vh" }}
      bg="gray.0"
      justifyContent="center"
      alignItems="center"
    >
      <Button bg="gray.4" onClick={handleSignIn} style={{ cursor: "pointer" }}>
        Sign In With Google
      </Button>
    </Flex>
  );
}
