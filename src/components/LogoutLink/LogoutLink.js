import React from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@rebass/emotion";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function LogoutLink(props) {
  const { user } = useAuthState(firebase.auth());
  const handleLogout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
    firebase.auth().signOut();
  };

  if (user) {
    return (
      <Box {...props}>
        <Text
          fontSize={1}
          style={{ textDecoration: "underline", cursor: "pointer" }}
          onClick={handleLogout}
        >
          Logout
        </Text>
      </Box>
    );
  } else {
    return null;
  }
}

LogoutLink.propTypes = {};
