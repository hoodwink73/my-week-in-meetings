import React from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@rebass/emotion";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Greeting({ ...props }) {
  const { user } = useAuthState(firebase.auth());

  return (
    <Box {...props}>
      <Text fontSize={2} fontWeight="bold">
        Hello, {user.displayName}
      </Text>
    </Box>
  );
}

Greeting.propTypes = {
  ...Box.propTypes
};
