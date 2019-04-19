import React from "react";
import PropTypes from "prop-types";
import { Line } from "rc-progress";

import { withTheme } from "emotion-theming";

import { Box } from "@rebass/emotion";

function Progress({ theme, percent, ...props }) {
  const { colors } = theme;
  return (
    <Box {...props}>
      <Line
        percent={percent}
        trailWidth={5}
        strokeWidth={5}
        strokeColor={colors.gray[3]}
        trailColor={colors.gray[1]}
      />
    </Box>
  );
}

Line.propTypes = {
  percent: PropTypes.number.isRequired
};

export default withTheme(Progress);
