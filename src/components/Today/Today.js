import React from "react";

import { useBeat } from "../../hooks";

export default function Today() {
  const lastUpdated = useBeat();
  return <>{lastUpdated.format("dddd, D MMM, h:mm A")}</>;
}
