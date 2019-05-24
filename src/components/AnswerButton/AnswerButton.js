import React from "react";
import PropTypes from "prop-types";
import { Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function AnswerButton({ title, onClick }) {
  return (
    <Button
      width={[4 / 5, 2 / 7]}
      onClick={onClick}
      bg="primary.5"
      color="white"
      mr={[0, 5]}
      mb={[4, 0]}
      fontSize={[5, 4]}
      css={css`
        font-weight: bold;
        box-shadow: 6px 6px 1px 0 #2186eb;
        cursor: pointer;
      `}
    >
      {title}
    </Button>
  );
}

AnswerButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
