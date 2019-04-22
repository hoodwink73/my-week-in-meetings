import React from "react";
import { storiesOf } from "@storybook/react";

import Tips from "../../components/Tips";

storiesOf("Tips", module).add("A tip appear as a card", () => (
  <Tips
    title="Do you know how to say NO to meetings"
    details={["Saying No is tough"]}
  />
));
