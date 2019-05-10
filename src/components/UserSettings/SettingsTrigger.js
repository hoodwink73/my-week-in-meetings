import React from "react";
import PropTypes from "prop-types";
import { Box, Text } from "@rebass/emotion";
import { ReactComponent as SettingsIcon } from "../../icons/icon-cog.svg";

export default function SettingsTrigger({ onToggle }) {
  return (
    <Box width={24} onClick={onToggle}>
      <SettingsIcon />
    </Box>
  );
}

SettingsTrigger.propTypes = {
  onToggle: PropTypes.func
};
