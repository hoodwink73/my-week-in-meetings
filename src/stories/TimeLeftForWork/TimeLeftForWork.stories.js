import React from "react";
import moment from "moment";
import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs";
import { withContexts } from "@storybook/addon-contexts/react";

import TimeLeftForWork from "../../components/TimeLeftForWork";
import { contexts } from "../config/context";

import * as MockDate from "mockdate";

storiesOf("Show time left for work today", module)
  .addDecorator(withKnobs)
  .addDecorator(withContexts(contexts))
  .add(
    "Time left for today",
    () => {
      const dateTime = text(
        "Mock datetime",
        moment().format("YYYY-MM-DD[T]HH:mm")
      );

      if (moment(dateTime).isValid()) {
        MockDate.set(dateTime);
      } else {
        console.error("Enter a valid date time");
      }
      MockDate.set(dateTime);

      return (
        <>
          <TimeLeftForWork
            selectedTimeRange={boolean("Show Week", true) ? "week" : "today"}
          />
        </>
      );
    },
    {
      notes: `
        The context addon is in alpha.
        Changing the knob value does not automatically update the story.
        Select, Note and then Canvas again to update the story

        So, if you want to test the \`TimeLeftForWork\` component during the first week of April

        -  select the appropriate context from the storybook toolbar
        -  change the date time in knobs to any time in first week of April like 2019-04-02T10:00

        `
    }
  );
