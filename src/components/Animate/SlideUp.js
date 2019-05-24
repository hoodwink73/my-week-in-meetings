import React, { useState, useEffect } from "react";
import { useTransition, animated, config } from "react-spring";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function FadeIn({ children }) {
  const [show, set] = useState(false);
  const transitions = useTransition(show, null, {
    from: { transform: "translate3d(0,100%,0)" },
    enter: { transform: "translate3d(0,0px,0)" },
    leave: { transform: "translate3d(0,-100%,0)" }
  });
  useEffect(() => {
    set(true);

    return () => {
      set(false);
    };
  });
  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div
          key={key}
          style={props}
          css={css`
            height: 100%;
          `}
        >
          {children}
        </animated.div>
      )
  );
}
