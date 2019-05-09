import React, { useState, useEffect } from "react";

export default function(intervalInMs) {
  const [renderCounter, setRenderCounter] = useState(0);

  useEffect(() => {
    const unsubscribeID = setInterval(() => {
      setRenderCounter(renderCounter + 1);
    }, intervalInMs);

    return () => clearInterval(unsubscribeID);
  });

  return renderCounter;
}
