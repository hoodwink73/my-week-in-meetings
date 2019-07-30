import React from "react";
import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Box, Text } from "@rebass/emotion";
import { Link } from "react-router-dom";
import useMedia from "react-use/lib/useMedia";

import Logo from "../Logo";
import bigBlobInBackground from "../../images/big-blob.svg";
import smallBlobInBackground from "../../images/small-blob.svg";
import Content from "./Content";

const DEFAULT_FONT_FAMILY = `
-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
`;

const leftBlobInBackground = css`
  background-image: url(${smallBlobInBackground});
  background-repeat: no-repeat;
  background-position: left bottom;
  background-size: 30%;
`;

const rightBlobInBackground = css`
  background-image: url(${bigBlobInBackground});
  background-repeat: no-repeat;
  background-position: left top;
`;

const Header = ({ ...props }) => (
  <Flex {...props}>
    <Logo />
  </Flex>
);

Header.propTypes = {
  ...Flex.propTypes
};

const ContentBox = ({ children, ...props }) => <Box {...props}>{children}</Box>;

ContentBox.propTypes = {
  ...Box.propTypes
};

const Decorate = ({ ...props }) => (
  <Box
    css={css`
      height: 100vh;
      ${rightBlobInBackground}
    `}
    {...props}
  />
);

Decorate.propTypes = {
  ...Box.propTypes
};

export default function About() {
  const isLarge = useMedia("(min-width: 64em)");
  const isLargeDesktop = useMedia("(min-width: 90em)");

  return (
    <Box
      width={1}
      css={css`
        @import url("https://fonts.googleapis.com/css?family=Montserrat:500|Quicksand:700&display=swap");

        height: 100vh;
        ${leftBlobInBackground}
      `}
    >
      <Header />
      <Flex width={1} mt={[4, 5]}>
        <ContentBox
          width={[0.6]}
          flex="1 1 600px"
          css={css`
          ${!isLarge &&
            `
            width: auto;
            left: 0;
            right: 0;
            padding: 20px;
          `}

          ${isLarge &&
            css`
              padding-left: 64px;
            `}

          ${isLargeDesktop &&
            css`
              padding-left: 132px;
            `}
      }
        `}
        >
          <Link
            to="/"
            css={css`
              margin: 0 16px;
              text-decoration: none;
            `}
          >
            <Text fontSize={[5]}>← </Text>
          </Link>
          <Text
            as="h1"
            fontSize={[6, 7]}
            fontFamily={`Quicksand, ${DEFAULT_FONT_FAMILY}`}
          >
            About
          </Text>

          <Content
            fontSize={[3]}
            fontWeight={500}
            fontFamily={`Montserrat, ${DEFAULT_FONT_FAMILY}`}
            mb={5}
            css={css`
              li {
                margin-bottom: 16px;
              }
            `}
          />
        </ContentBox>
        <Decorate width={[0.4]} flex="3 4 auto" />
      </Flex>
    </Box>
  );
}

About.propTypes = {
  onSignIn: PropTypes.func.isRequired
};
