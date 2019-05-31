import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import Button from "../Button";
import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";

const defaultContent = `
I am unclear about the agenda of the meeting. Can you please clarify it?

If the meeting requires me to preapre something, can you list them?
`;

export default function AgendaResponse({ onDeclineResponse }) {
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
            onDeclineResponse(content);
            setLoading(true);
          }}
        >
          Decline And Send
        </Button>
      </Flex>
    </Box>
  );
}
