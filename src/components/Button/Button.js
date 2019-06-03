import React from "react";
import PropType from "prop-types";
import { Flex, Button as RebassButton, Box } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import delve from "dlv";

import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";

const buttonStyles = new Map([
  ["primary", { bg: "primary.6" }],
  [
    "small",
    {
      fontSize: 1,
      py: 1,
      px: 2
    }
  ],
  [
    "medium",
    {
      fontSize: 2
    }
  ]
]);

export default function Button({ children, size, type, loading, ...props }) {
  return (
    <RebassButton
      {...buttonStyles.get(type)}
      {...buttonStyles.get(size)}
      {...props}
    >
      <Flex alignItems="center">
        {loading && (
          <Box
            width="1em"
            pt={1}
            mr={2}
            css={({ colors }) => css`
              .primary {
                fill: ${colors.white[0]};
              }

              .secondary {
                fill: ${delve(colors, buttonStyles.get(type).bg)};
              }
            `}
          >
            <LoadingIcon />
          </Box>
        )}
        <Box>{children}</Box>
      </Flex>
    </RebassButton>
  );
}

Button.propTypes = {
  size: PropType.oneOf(["small", "medium"]),
  type: PropType.oneOf(["primary"])
};
