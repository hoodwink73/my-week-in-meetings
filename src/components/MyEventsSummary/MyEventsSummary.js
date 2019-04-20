import React, { createContext, useState } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument, useCollection } from "react-firebase-hooks/firestore";
import { Button, Heading, Flex, Box } from "@rebass/emotion";

import Time from "../Time";
import moment from "moment";
import {
  getStartOfWeekInUTC,
  filterEventsForToday,
  sortEvents
} from "../../utils";
import mock from "../../mock";
import Greeting from "../Greeting";
import SelectTimeRange from "../SelectTimeRange";
import TimeLeftForWork from "../TimeLeftForWork";

export const EventsContext = createContext(null);

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
  const startOfWeek = mock.START_OF_WEEK;

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

  const [selectedTimeRange, setSelectedTimeRange] = useState("today");
  const handleTimeRangeToggle = selectedTabIndex => {
    if (selectedTabIndex === 0) {
      setSelectedTimeRange("today");
    } else if (selectedTabIndex === 1) {
      setSelectedTimeRange("week");
    }
  };

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

  let eventsThisWeek = [],
    eventsToday = [],
    timeLeftForWorkToday;

  if (
    !eventsForThisWeekFirebaseRequest.loading &&
    !eventsForThisWeekFirebaseRequest.value.empty
  ) {
    eventsForThisWeekFirebaseRequest.value.forEach(function(doc) {
      eventsThisWeek.push(doc.data());
    });

    eventsToday = filterEventsForToday(eventsThisWeek);
  }

  if (calendarDetailsFirebaseRequest.data) {
    return (
      <EventsContext.Provider value={eventsThisWeek}>
        <Flex width="100%" bg="gray.0" justifyContent="center">
          <Box width={600} py={6}>
            {user && <Greeting name={user.displayName} my={3} />}
            <SelectTimeRange
              handleTimeRangeToggle={handleTimeRangeToggle}
              my={3}
            >
              <TimeLeftForWork
                selectedTimeRange={selectedTimeRange}
                my={3}
                width={256}
              />
            </SelectTimeRange>
            <Button onClick={handleLogout}> Logout </Button>
          </Box>
        </Flex>
      </EventsContext.Provider>
    );
  } else {
    return null;
  }
}
