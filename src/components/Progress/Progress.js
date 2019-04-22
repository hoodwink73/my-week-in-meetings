import React from "react";
import PropTypes from "prop-types";
import { Line } from "rc-progress";
import { Box } from "@rebass/emotion";
import { withTheme } from "emotion-theming";

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
        style={{ height: "8px" }}
      />
    </Box>
  );
}

Line.propTypes = {
  percent: PropTypes.number.isRequired,
  ...Box.propTypes
};

export default withTheme(Progress);
