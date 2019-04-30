import React from "react";
import { Global, css } from "@emotion/core";

export default function() {
  return (
    <Global
      styles={theme => css`
        .primary {
          fill: ${theme.colors.gray[0]};
        }

        .secondary {
          fill: ${theme.colors.gray[1]};
        }
      `}
    />
  );
}