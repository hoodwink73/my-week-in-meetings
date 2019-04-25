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
import { userAggregatedEventData } from "../../hooks";
import Greeting from "../Greeting";
import SelectTimeRange from "../SelectTimeRange";
import TimeLeftForWork from "../TimeLeftForWork";
import LogoutLink from "../LogoutLink";
import Tips from "../Tips";
import AnalyticsCard from "../AnalyticsCard";

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
      <EventsContext.Provider
        value={{
          eventsThisWeek
        }}
      >
        <Flex width="100%" bg="gray.0" flexDirection="column">
          <LogoutLink alignSelf="flex-end" mt={2} mr={4} />
          <Box width={[1, 600]} px={[4, 0]} py={4} alignSelf="center">
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
          </Box>
        </Flex>
        <Flex justifyContent="center">
          <Box m={4}>
            <Tips
              title="Do you say no to meetings if they are not important?"
              details={["Saying no to meetings might be challenging"]}
            />
          </Box>
        </Flex>
        <Flex justifyContent="center">
          <Box mx={4} my={2}>
            <AnalyticsCard
              title="Do you say no to meetings if they are not important?"
              details={["Saying no to meetings might be challenging"]}
            />
          </Box>
        </Flex>
      </EventsContext.Provider>
    );
  } else {
    return null;
  }
}
