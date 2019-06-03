import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import Button from "../Button";

export default function Response({
  onDeclineResponse,
  content: defaultContent
}) {
  const [content, setContent] = useState(defaultContent);
  const [loading, setLoading] = useState(false);

  const handleChange = ({ target }) => {
    setContent(target.value);
  };

  return (
    <Box width={1}>
      <textarea
        value={content}
        onChange={handleChange}
        css={({ colors }) => css`
          width: 90%;
          padding: 8px;
          display: block;
          box-sizing: border-box;
          margin: auto;
          height: 150px;
          border: 2px solid ${colors.neutrals[2]};
          border-radius: 10px;
          font-size: 16px;
        `}
      />

      <Flex width={9 / 10} mx="auto" justifyContent="flex-end" my={3}>
        <Button
          loading={loading}
          size="medium"
          type="primary"
          onClick={() => {
            setLoading(true);
            onDeclineResponse(content);
          }}
        >
          Decline And Send
        </Button>
      </Flex>
    </Box>
  );
}

Response.propTypes = {
  content: PropTypes.string.isRequired,
  onDeclineResponse: PropTypes.func.isRequired
};
