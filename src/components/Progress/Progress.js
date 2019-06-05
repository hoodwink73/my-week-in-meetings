import React from "react";
import PropTypes from "prop-types";
import { Circle } from "rc-progress";
import { Box } from "@rebass/emotion";
import { withTheme } from "emotion-theming";

function Progress({ theme, percent, ...props }) {
  const { colors } = theme;
  return (
    <Box {...props}>
      <Circle
        percent={percent}
        trailWidth={20}
        strokeWidth={20}
        strokeColor={colors.primary[5]}
        trailColor={colors.primary[2]}
        style={{}}
      />
    </Box>
  );
}

Progress.propTypes = {
  percent: PropTypes.number.isRequired,
  ...Box.propTypes
};

export default withTheme(Progress);
