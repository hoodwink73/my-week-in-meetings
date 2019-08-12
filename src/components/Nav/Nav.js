import React from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";
import { rgba } from "polished";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Text } from "@rebass/emotion";
import useMedia from "react-use/lib/useMedia";

const DEFAULT_FONT_FAMILY = `
-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
`;

export default function Nav({ ...props }) {
  const isSmall = useMedia("(max-width: 40em )");
  return (
    <Flex as={Text} fontSize={[1, 2]} {...props}>
      <Route
        path="/"
        exact
        render={({ match }) =>
          match && (
            <Link
              to="/about/"
              css={theme => css`
                align-self: flex-start;
                width: ${isSmall ? "7ch" : "10ch"};
                margin-top: ${isSmall
                  ? "calc(2ch + 10px)"
                  : "calc(3ch + 10px)"};
                margin-right: ${isSmall ? "1ch" : "3ch"};
                color: ${theme.colors.primary[6]};
                font-family: Montserrat, ${DEFAULT_FONT_FAMILY};
                text-transform: uppercase;
                text-decoration: none;
                font-weight: bold;
                background-color: ${rgba(theme.colors.primary[1], 0.6)};
                padding: ${isSmall ? "4px" : "16px"};
                border-radius: 25px;
                cursor: pointer;
                text-align: center;
              `}
            >
              About
            </Link>
          )
        }
      />
    </Flex>
  );
}

Nav.propTypes = {
  ...Flex.propTypes
};
