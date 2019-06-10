import firebase from "@firebase/app";
import "@firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { getStartOfWeekInUTC } from "../utils";
import { EVENT_STATUSES } from "../constants";

export default function(week = 0, googleID) {
  const startOfWeek = getStartOfWeekInUTC(week);
  var { error, loading, value } = useCollection(
    firebase
      .firestore()
      .collection(`users/${googleID}/events`)
      .where("enrichedData.week", "==", startOfWeek)
  );

  var data = [];
  if (!loading && !error) {
    if (!value.empty) {
      value.forEach(docSnapshot => {
        // we do not want to count declined events
        // we do not want to count events which do not any attendee

        const event = docSnapshot.data();

        let attendeeMe, areThereOtherAttendees;

        if (event.attendees) {
          [attendeeMe] = event.attendees.filter(attendee => attendee.self);

          areThereOtherAttendees = !!event.attendees.filter(
            attendee => !attendee.self
          ).length;

          // sometimes you can organise an event (hence the event will be in your calendar)
          // but choose to opt-out of the attendee list
          // so we need to check whether the attendee list includes you
          // before we can check your response status to the event
          if (
            attendeeMe &&
            attendeeMe.responseStatus !== EVENT_STATUSES.get("Declined")
          ) {
            if (areThereOtherAttendees) {
              data.push(event);
            }
          }
        }
      });
    }
  }

  if (error) {
    console.error(error);
  }

  return {
    loading,
    error,
    data
  };
}
