import React from "react";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Box, Text } from "@rebass/emotion";
import useMedia from "react-use/lib/useMedia";

export default function Logo() {
  const isLarge = useMedia("(min-width: 64em)");
  const isLargeDesktop = useMedia("(min-width: 90em)");

  return (
    <>
      <Text
        css={css`
      position: absolute;
      text-transform: uppercase;
      top: 20px;
      letter-spacing: 10px;
      width: 100%;
      ${!isLarge &&
        `
        width: auto;
        left: 0;
        background-color: #ffffff5c;
        border-radius: 10px;
        padding: 20px;
        font-size: 14px;
        letter-spacing: 6px;
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
        fontWeight={700}
        fontSize={[2, 3]}
      >
        Deepwork.today
        {isLarge && (
          <Box mt={3}>
            <a
              href="https://www.producthunt.com/posts/deepwork-today?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-deepwork-today"
              target="_blank"
            >
              <img
                src="https://api.producthunt.com/widgets/embed-image/v1/top-post-badge.svg?post_id=164154&theme=light&period=daily"
                alt="Deepwork.today - Keep a tab on your day | Product Hunt Embed"
                style={{ width: "250px", height: "54px" }}
                width="250px"
                height="54px"
              />
            </a>
          </Box>
        )}
      </Text>
    </>
  );
}
