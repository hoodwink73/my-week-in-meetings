import moment from "moment";

import groupEventsByTime from "./groupEventsByTime";
import sortEvents from "./sortEvents";
import timeInOverlappedMeetingsInMs from "./timeInOverlappedMeetingsInMs";
import mock from "../mock";

export default function timeLeftForWorkTodayInMs(
  events,
  workDayTiming = {
    start: mock.WORK_START_TIME,
    end: mock.WORK_END_TIME
  }
) {
  let { happening, willHappen } = groupEventsByTime(events);
  // TODO: Remove the hard coded value here
  let now = moment(mock.NOW);

  // TODO: Remove the hard coded value here
  const workStartTime = moment(mock.TODAY)
    .hours(workDayTiming.start.hours)
    .minutes(workDayTiming.start.minutes);

  // TODO: Remove the hard coded value here
  let workEndTime = moment(mock.TODAY)
    .hours(workDayTiming.end.hours)
    .minutes(workDayTiming.end.minutes);

  // if the workday hasn't begun, we should only start counting from beginning
  // of the work day
  if (now.isBefore(workStartTime, "minutes")) {
    now = workStartTime;
  }

  // if the current instant is beyond worday end
  // no time left for work today
  if (
    now.isAfter(workEndTime, "minutes") ||
    now.isSame(workEndTime, "minutes")
  ) {
    return 0;
  }

  let futureEventsDuration = [];

  // filter events happening after workday end
  willHappen = willHappen.filter(event => {
    if (
      moment(event.start.dateTime).isAfter(workEndTime, "minute") ||
      moment(event.start.dateTime).isSame(workEndTime, "minute")
    ) {
      return false;
    } else {
      return true;
    }
  });

  futureEventsDuration = futureEventsDuration.concat(
    willHappen.map(event => {
      if (
        workEndTime.isBetween(
          moment(event.start.dateTime),
          moment(event.end.dateTime),
          "minute"
        )
      ) {
        return workEndTime.diff(event.start.dateTime, "milliseconds");
      } else {
        return event.enrichedData.durationInMs;
      }
    })
  );

  // there can be meetings that are overlapping
  // and these time of overlaps should not be deducted from the available
  // time of work
  const effectiveTimeInOverlappedEventsInMs =
    willHappen.length > 0 ? timeInOverlappedMeetingsInMs(willHappen) : 0;

  // if a meeting is happening now, no *work* can be done until it gets over
  // so we can safely say that the work time start at this instant but only after
  // the meeting
  // if multiple events are happening at the same we would want the event whose
  // end time is the latest
  if (happening.length > 0) {
    const eventWhichIsTheLastToEnd = sortEvents(happening, {
      ascending: false,
      key: "end.dateTime"
    })[0];

    // if a current meeting (which is occuring now) lasts beyond the workday end
    // then no time is left for work today
    if (moment(eventWhichIsTheLastToEnd.end.dateTime).isAfter(workEndTime)) {
      return 0;
    } else {
      now = moment(eventWhichIsTheLastToEnd.end.dateTime);
    }
  }

  const totalTimeLeftForWorkTodayInMs = workEndTime.diff(now, "milliseconds");
  const timeThatWillBeSpentInMeetingsTodayInMs = futureEventsDuration.reduce(
    (sum, current) => sum + current,
    0
  );

  const totalWorkTimeLeftToday =
    totalTimeLeftForWorkTodayInMs -
    timeThatWillBeSpentInMeetingsTodayInMs +
    effectiveTimeInOverlappedEventsInMs;

  return totalWorkTimeLeftToday;
}
