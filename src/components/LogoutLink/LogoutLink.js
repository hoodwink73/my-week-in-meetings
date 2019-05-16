/** @jsx jsx */
import React from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@rebass/emotion";
import { css, jsx } from "@emotion/core";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactComponent as LogoutIcon } from "../../icons/icon-door-enter.svg";

export default function LogoutLink(props) {
  const { user } = useAuthState(firebase.auth());
  const handleLogout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
    firebase.auth().signOut();
  };

  if (user) {
    return (
      <Box
        width={24}
        onClick={handleLogout}
        {...props}
        css={css`
          cursor: pointer;
        `}
      >
        <LogoutIcon />
      </Box>
    );
  } else {
    return null;
  }
}

LogoutLink.propTypes = {};
