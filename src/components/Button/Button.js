import React from "react";
import PropType from "prop-types";
import { Flex, Button as RebassButton, Box } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const buttonStyles = new Map([
  ["primary", { bg: "primary.6" }],
  ["small", { fontSize: 1 }]
]);

export default function Button({ children, size, type, ...props }) {
  return (
    <RebassButton
      variant={size}
      {...buttonStyles.get(type)}
      {...buttonStyles.get(size)}
      {...props}
    >
      {children}
    </RebassButton>
  );
}

Button.propTypes = {
  size: PropType.oneOf(["small"]),
  type: PropType.oneOf(["primary"])
};
