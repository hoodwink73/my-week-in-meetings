import moment from "moment";
import groupEventsByTime from "./groupEventsByTime";
import sortEvents from "./sortEvents";
import { COOL_OFF_TIME_IN_MINUTES } from "../constants";

export default function areWeCloseToAMeeting(events) {
  const { happened, happening, willHappen } = groupEventsByTime(events);
  const results = new Map();
  const now = moment();

  // when a meeting is already happening
  // we are not interested in cool off periods
  if (happening.length > 0) {
    return results;
  }

  // figure out if a meeting has ended recently
  // and we are inside a cool off period

  if (happened.length > 0) {
    var [lastEventToEnd] = sortEvents(events, {
      key: "end.dateTime",
      ascending: false
    });

    var postMeetingCoolOffBegins = moment(lastEventToEnd.end.dateTime);
    var postMeetingCoolOffEnds = moment(lastEventToEnd.end.dateTime).add(
      COOL_OFF_TIME_IN_MINUTES,
      "minutes"
    );

    if (
      now.isBetween(
        postMeetingCoolOffBegins,
        postMeetingCoolOffEnds,
        "minutes",
        "[)"
      )
    ) {
      results.set("coolOff", {
        timeLeftInMs: postMeetingCoolOffEnds.diff(now, "milliseconds")
      });
    }
  }

  // figure out if a meeting is about to start soon
  // and whether its time to prepare for it
  //
  if (willHappen.length > 0) {
    var [firstEventToStart] = sortEvents(events, {
      key: "start.dateTime"
    });

    var meetingPreparationTimeBegins = moment(
      firstEventToStart.start.dateTime
    ).subtract(COOL_OFF_TIME_IN_MINUTES, "minutes");
    var meetingPreparationTimeEnds = moment(firstEventToStart.start.dateTime);

    if (
      now.isBetween(
        meetingPreparationTimeBegins,
        meetingPreparationTimeEnds,
        "minutes",
        "[)"
      )
    ) {
      result.set("prepare", {
        timeLeftInMs: meetingPreparationTimeEnds.diff(now, "milliseconds")
      });
    }
  }
}
