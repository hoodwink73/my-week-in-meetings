import React from "react";
import PropTypes from "prop-types";
import { Link, Route } from "react-router-dom";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Flex, Text } from "@rebass/emotion";

const DEFAULT_FONT_FAMILY = `
-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
  "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;
`;

export default function Nav({ ...props }) {
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
                width: 10ch;
                margin-top: calc(3ch + 10px);
                color: ${theme.colors.primary[6]};
                font-family: Montserrat, ${DEFAULT_FONT_FAMILY};
                text-transform: uppercase;
                font-weight: bold;
                cursor: pointer;
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
