import React from "react";
import PropTypes from "prop-types";
import { Flex, Card } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function Pagination({ width, count, current, ...props }) {
  return (
    <Flex>
      {[...Array(count - 1)].map((_, index) => (
        <Card
          key={index}
          width={width}
          mr={2}
          css={css`
            height: ${width}px;
          `}
          bg={current === index + 1 ? "primary.2" : "neutrals.2"}
          borderRadius="50%"
          {...props}
        />
      ))}
    </Flex>
  );
}

Pagination.propTypes = {
  width: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired
};
