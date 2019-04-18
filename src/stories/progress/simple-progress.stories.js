import React from "react";
import { storiesOf } from "@storybook/react";

import Progress from "../../components/Progress";
import notes from "./simple-progress.md";

storiesOf("Progress", module).add(
  "a progress bar",
  () => <Progress width={256} m={1} percent={93} />,
  {
    notes
  }
);
