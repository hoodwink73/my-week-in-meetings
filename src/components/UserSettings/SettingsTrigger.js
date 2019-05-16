/** @jsx jsx */
import React from "react";
import PropTypes from "prop-types";
import { css, jsx } from "@emotion/core";
import { Box } from "@rebass/emotion";
import { ReactComponent as SettingsIcon } from "../../icons/icon-cog.svg";

export default function SettingsTrigger({ onToggle }) {
  return (
    <Box
      width={24}
      onClick={onToggle}
      css={css`
        cursor: pointer;
      `}
    >
      <SettingsIcon />
    </Box>
  );
}

SettingsTrigger.propTypes = {
  onToggle: PropTypes.func
};
