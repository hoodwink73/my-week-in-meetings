import React from "react";
import { storiesOf } from "@storybook/react";
import { withContexts } from "@storybook/addon-contexts/react";

import { contexts } from "../config/context";
import { FirestoreDataContext } from "../../components/FirestoreData";
import { UserConfigContext } from "../../components/UserConfig";

import AnalyticsCard from "../../components/AnalyticsCard";

storiesOf("Analytics Card")
  .addDecorator(withContexts(contexts))
  .add(
    "Time spent in meetings relative to work hours express as percent",
    () => {
      return <AnalyticsCard type="timeSpentInMeetings" />;
    }
  )
  .add("Busiest day of week", () => {
    return <AnalyticsCard type="busiestDay" />;
  })
  .add("Who invited you to the most number of meetings", () => {
    return <AnalyticsCard type="topOrganizer" />;
  });
// TODO
// this story includes component dependent on firebase
// hence requires us to initialize firebase
// will try to resolve later
// .add("Meetings attended organised by outside the company vs inside", () => {
//   return <AnalyticsCard type="meetingsByDomains" />;
// });
