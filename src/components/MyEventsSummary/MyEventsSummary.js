import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import { Button, Heading } from "@rebass/emotion";

import Time from "../Time";
import moment from "moment";
import getStartOfWeekInUTC from "../../utils";

export default function MyEventsSummary() {
  let calendarDetails, thisWeekAggregateDetails;

  const { user } = useAuthState(firebase.auth());

  const [{ uid: googleID }] = user.providerData.filter(
    ({ providerId }) => providerId === "google.com"
  );

  // TODO: replace the hard-coded week value
  // const startOfWeek = getStartOfWeekInUTC();
  const startOfWeek = "2019-03-31T18:30:00.000Z";

  {
    const { error, loading, value } = useDocument(
      firebase.firestore().doc(`users/${googleID}`)
    );

    calendarDetails = { error, loading, value };
  }

  {
    const { error, loading, value } = useDocument(
      firebase.firestore().doc(`users/${googleID}/aggregates/${startOfWeek}`)
    );

    thisWeekAggregateDetails = { error, loading, value };
  }

  if (!calendarDetails.loading && calendarDetails.value.exists) {
    calendarDetails.data = calendarDetails.value.data();
  }

  if (
    !thisWeekAggregateDetails.loading &&
    thisWeekAggregateDetails.value.exists
  ) {
    thisWeekAggregateDetails.data = thisWeekAggregateDetails.value.data();
  }

  const handleLogout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
    firebase.auth().signOut();
  };

  const totalMeetingTimeToday =
    thisWeekAggregateDetails.data &&
    thisWeekAggregateDetails.data.eventsFrequencyByDayOfWeek[moment().day()];

  if (calendarDetails.data) {
    return (
      <>
        <div>
          You are viewing the calendar for{" "}
          {calendarDetails.data.calendar.summary}
        </div>

        {totalMeetingTimeToday && (
          <>
            <Heading>Total Work Time today</Heading>
            <Time timeInMs={totalMeetingTimeToday} />
          </>
        )}
        <Button onClick={handleLogout}> Logout </Button>
      </>
    );
  } else {
    return null;
  }
}
