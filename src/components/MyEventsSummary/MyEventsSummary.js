import React from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { Button, Heading } from "@rebass/emotion";

import Time from "../Time";
import moment from "moment";
import {
  getStartOfWeekInUTC,
  filterEventsForToday,
  timeLeftForWorkTodayInMs,
  sortEvents
} from "../../utils";

export default function MyEventsSummary() {
  let calendarDetailsFirebaseRequest,
    thisWeekAggregateDetailsFirebaseRequest,
    eventsForThisWeekFirebaseRequest;

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

    calendarDetailsFirebaseRequest = { error, loading, value };
  }

  {
    const { error, loading, value } = useDocument(
      firebase.firestore().doc(`users/${googleID}/aggregates/${startOfWeek}`)
    );

    thisWeekAggregateDetailsFirebaseRequest = { error, loading, value };
  }

  {
    const { error, loading, value } = useCollection(
      firebase
        .firestore()
        .collection(`users/${googleID}/events`)
        .where("enrichedData.week", "==", startOfWeek)
    );

    eventsForThisWeekFirebaseRequest = { error, loading, value };
  }

  if (
    !calendarDetailsFirebaseRequest.loading &&
    calendarDetailsFirebaseRequest.value.exists
  ) {
    calendarDetailsFirebaseRequest.data = calendarDetailsFirebaseRequest.value.data();
  }

  if (
    !thisWeekAggregateDetailsFirebaseRequest.loading &&
    thisWeekAggregateDetailsFirebaseRequest.value.exists
  ) {
    thisWeekAggregateDetailsFirebaseRequest.data = thisWeekAggregateDetailsFirebaseRequest.value.data();
  }

  const handleLogout = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signOut();
    firebase.auth().signOut();
  };

  const totalMeetingTimeToday =
    thisWeekAggregateDetailsFirebaseRequest.data &&
    thisWeekAggregateDetailsFirebaseRequest.data.eventsFrequencyByDayOfWeek[
      moment().day()
    ];

  let eventsToday, timeLeftForWorkToday;

  if (
    !eventsForThisWeekFirebaseRequest.loading &&
    !eventsForThisWeekFirebaseRequest.value.empty
  ) {
    let eventsThisWeek = (eventsToday = []);
    eventsForThisWeekFirebaseRequest.value.forEach(function(doc) {
      eventsThisWeek.push(doc.data());
    });

    eventsToday = filterEventsForToday(eventsThisWeek);
    timeLeftForWorkToday = timeLeftForWorkTodayInMs(eventsToday);
  }

  if (calendarDetailsFirebaseRequest.data) {
    return (
      <>
        <div>
          You are viewing the calendar for{" "}
          {calendarDetailsFirebaseRequest.data.calendar.summary}
        </div>

        {totalMeetingTimeToday && (
          <>
            <Heading>Total Work Time today</Heading>
            <Time timeInMs={totalMeetingTimeToday} />
          </>
        )}

        {timeLeftForWorkToday && (
          <>
            <Heading>Total Time Left For Work Today</Heading>
            <Time timeInMs={timeLeftForWorkToday} />
          </>
        )}

        {eventsToday &&
          sortEvents(eventsToday).map(event => (
            <div key={event.start.dateTime}>
              {event.summary} – {moment(event.start.dateTime).format("k : mm")}{" "}
              – {moment(event.end.dateTime).format("k : mm")}
            </div>
          ))}

        <Button onClick={handleLogout}> Logout </Button>
      </>
    );
  } else {
    return null;
  }
}
