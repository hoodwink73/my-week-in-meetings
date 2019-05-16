import React, { useState } from "react";
import { Button } from "@rebass/emotion";
import ASQ from "asynquence";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import { Flex, Box, Text } from "@rebass/emotion";
import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";

export default function Login() {
  const [isAuthenticationInProgress, setAuthenticationInProgress] = useState(
    false
  );

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
      .then((done, { code }) => {
        setAuthenticationInProgress(true);
        auth2.currentUser.listen(user => {
          done({
            authorizationCode: code,
            googleID: user.getId()
          });
        });
      })
      .seq(persistOfflineAccessToken)
      .val(({ data: idToken }) => ({ idToken }))
      .seq(signInWithFirebase)
      .val(
        () => setAuthenticationInProgress && setAuthenticationInProgress(false)
      )
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
      <Button
        bg={isAuthenticationInProgress ? "white.1" : "gray.4"}
        color={isAuthenticationInProgress ? "gray.4" : "white.1"}
        onClick={handleSignIn}
        style={{ cursor: "pointer" }}
        disabled={isAuthenticationInProgress}
      >
        <Flex justifyContent="center" alignItems="center">
          {isAuthenticationInProgress && (
            <Box width={24} pt={1} mr={2}>
              <LoadingIcon />
            </Box>
          )}

          <Text>
            {isAuthenticationInProgress ? "Signing In" : "Sign In With Google"}
          </Text>
        </Flex>
      </Button>
    </Flex>
  );
}
