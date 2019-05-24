import React, { useState, useEffect } from "react";
import { useTransition, animated, config } from "react-spring";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

export default function FadeIn({ children }) {
  const [show, set] = useState(false);
  const transitions = useTransition(show, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { ...config.molasses }
  });

  useEffect(() => {
    set(true);
  }, []);

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
