import React from "react";
import { Global, css } from "@emotion/core";
import "@reach/tooltip/styles.css";

export default function() {
  return (
    <Global
      styles={theme => css`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        body,
        html {
          width: 100%;
          height: 100%;

          ul,
          li {
            list-style-type: none;
            padding: 0;
          }
        }
        .primary {
          fill: ${theme.colors.gray[0]};
          &:hover {
            fill: ${theme.colors.gray[1]};
          }
        }

        .secondary {
          fill: ${theme.colors.gray[2]};
        }

        .loading-icon {
          animation-duration: 1s;
          animation-name: rotate;
          animation-iteration-count: infinite;
          animation-direction: alternate;
        }

        ${"" /* When the modal is open the actual app shouldn't scroll */}
        .ReactModal__Body--open {
          overflow: hidden;
        }

        .ReactModal__Overlay {
          opacity: 0;
          transition: opacity 200ms ease-in-out;
        }

        .ReactModal__Overlay--after-open {
          opacity: 1;
        }

        .ReactModal__Content--after-open.animate-height {
          transition: height 300ms 200ms;
        }

        .ReactModal__Overlay--before-close {
          opacity: 0;
        }
      `}
    />
  );
}
