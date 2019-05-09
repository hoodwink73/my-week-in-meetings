import React from "react";
import PropTypes from "prop-types";
import delve from "dlv";
import { Box, Text, Flex } from "@rebass/emotion";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import Avatar from "../Avatar";
import Today from "../Today";

export default function Greeting({ ...props }) {
  const { user } = useAuthState(firebase.auth());

  return (
    <Flex {...props}>
      <Avatar mr={2} alignSelf="center" />
      <Box alignSelf="center">
        <Flex
          flexDirection="column"
          justifyContent="space-between"
          style={{ height: "70%" }}
        >
          <Text fontSize={3} fontWeight="bold" py={1}>
            Hello, {user.displayName.split(" ")[0]}
          </Text>
          <Text fontSize={1}>
            <Today />
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}

Greeting.propTypes = {
  ...Box.propTypes
};
