import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Box } from "@rebass/emotion";

import SettingsTrigger from "./SettingsTrigger";
import SettingsDetails from "./SettingsDetails";

export default function UserSettings({ ...props }) {
  const [isExpanded, expandUserSettings] = useState(false);

  const toggleTipDetails = () => {
    expandUserSettings(!isExpanded);
  };

  return (
    <Box {...props}>
      <SettingsTrigger onToggle={toggleTipDetails} />
      <SettingsDetails isOpen={isExpanded} onToggle={toggleTipDetails} />
    </Box>
  );
}

UserSettings.propTypes = {
  ...Box.propTypes
};
