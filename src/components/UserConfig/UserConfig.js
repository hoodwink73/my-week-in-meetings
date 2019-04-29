import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const UserConfigContext = createContext();

export default function UserConfig({ children }) {
  const [userConfig, setUserConfig] = useState({
    workStartTime: { hours: 9, minutes: 0 },
    workEndTime: { hours: 21, minutes: 0 }
  });

  const userConfigStateAndHelpers = {
    userConfig,
    setUserConfig
  };

  return (
    <UserConfigContext.Provider value={userConfigStateAndHelpers}>
      {children}
    </UserConfigContext.Provider>
  );
}

UserConfig.propTypes = {
  children: PropTypes.node.isRequired
};
