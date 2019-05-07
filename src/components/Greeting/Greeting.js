import React from "react";
import PropTypes from "prop-types";
import delve from "dlv";
import { Box, Text, Flex } from "@rebass/emotion";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import Avatar from "../Avatar";

export default function Greeting({ ...props }) {
  const { user } = useAuthState(firebase.auth());

  return (
    <Flex {...props} flex>
      <Avatar mr={3} alignSelf="center" />
      <Text fontSize={3} fontWeight="bold" py={2}>
        Hello, {user.displayName.split(" ")[0]}
      </Text>
    </Flex>
  );
}

Greeting.propTypes = {
  ...Box.propTypes
};
