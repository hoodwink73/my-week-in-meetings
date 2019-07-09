import React from "react";
import PropTypes from "prop-types";
import { Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import Button from "../Button";

export default function AnswerButton({ title, onClick, ...props }) {
  return (
    <Button
      width={[1 / 4, 1 / 5]}
      size="medium"
      type="primary"
      onClick={onClick}
      {...props}
    >
      <Text width={1} fontSize={1}>
        {title}
      </Text>
    </Button>
  );
}

AnswerButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
