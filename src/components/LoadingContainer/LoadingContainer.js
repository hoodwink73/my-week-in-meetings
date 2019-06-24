import React from "react";
import PropTypes from "prop-types";
import { Box } from "@rebass/emotion";

import { ReactComponent as LoadingIcon } from "../../icons/icon-refresh.svg";

export default function LoadingContainer({ isLoading, children }) {
  if (isLoading) {
    return (
      <Box width={1} p={6}>
        <Box width={64} mx="auto">
          <LoadingIcon />
        </Box>
      </Box>
    );
  } else {
    return <>{children}</>;
  }
}

LoadingContainer.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};
