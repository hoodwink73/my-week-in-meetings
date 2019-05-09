import React from "react";
import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Image } from "@rebass/emotion";
import delve from "dlv";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function Avatar({ ...props }) {
  const { user } = useAuthState(firebase.auth());

  const userProfilePicSrc = delve(user, "providerData.0.photoURL", null);
  // const userProfilePicSrc =
  //   "https://api.adorable.io/avatars/285/hoodwink73@gmail.com";

  if (userProfilePicSrc) {
    return (
      <Image
        width={[64]}
        src={userProfilePicSrc}
        borderRadius={[32]}
        css={theme => css`
          border: 5px solid white;
          box-shadow: ${theme.shadows.small};
        `}
        {...props}
      />
    );
  } else {
    return null;
  }
}
