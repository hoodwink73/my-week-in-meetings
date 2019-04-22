import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import TipsCard from "./TipsCard";
import TipsDetails from "./TipsDetails";

export default function Tips({ title, details }) {
  const [isExpanded, expandTip] = useState(false);

  const toggleTipDetails = () => {
    expandTip(!isExpanded);
  };

  return (
    <>
      <TipsCard title={title} onToggle={toggleTipDetails} />
      <TipsDetails
        isOpen={isExpanded}
        details={details}
        onToggle={toggleTipDetails}
      />
    </>
  );
}

Tips.propTypes = {
  title: PropTypes.string.isRequired,
  details: PropTypes.arrayOf(PropTypes.string).isRequired
};
