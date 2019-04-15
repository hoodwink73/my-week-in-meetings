import React from "react";
import { storiesOf } from "@storybook/react";

import Time from "../../components/Time";

storiesOf("Time", module).add("User friendly way to show much time", () => (
  <Time timeInMs={72300000} />
));
