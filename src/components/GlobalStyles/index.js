import React from "react";
import { Global, css } from "@emotion/core";

export default function() {
  return (
    <Global
      styles={theme => css`
        body,
        html {
          width: 100%;
          height: 100%;
        }
        .primary {
          fill: ${theme.colors.gray[1]};
        }

        .secondary {
          fill: ${theme.colors.gray[2]};
        }
      `}
    />
  );
}
