import moment from "moment";

import groupEventsByTime from "./groupEventsByTime";
import sortEvents from "./sortEvents";
import timeInOverlappedMeetingsInMs from "./timeInOverlappedMeetingsInMs";
import getWorkHours from "./getWorkHours";
import mock from "../mock";

// TODO: Remove the hard coded value here
// this has to be set by user and we need to have default
// value to start with
const workDayTiming = {
  start: mock.WORK_START_TIME,
  end: mock.WORK_END_TIME
};

function timeLeftForWorkTodayInMs(
  events,
  { workStartTime, workEndTime, fromTime }
) {
  // TODO: Remove the hard coded value here
  let now = moment(mock.NOW);

  if (moment.isMoment(fromTime)) {
    now = fromTime;
  }

  let { happening, willHappen } = groupEventsByTime(events, now);

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

  const totaltimeLeftForWorkInMs = workEndTime.diff(now, "milliseconds");
  const timeThatWillBeSpentInMeetingsTodayInMs = futureEventsDuration.reduce(
    (sum, current) => sum + current,
    0
  );

  const totalWorkTimeLeftToday =
    totaltimeLeftForWorkInMs -
    timeThatWillBeSpentInMeetingsTodayInMs +
    effectiveTimeInOverlappedEventsInMs;

  return totalWorkTimeLeftToday;
}

// TODO: Remove hardcoded value for now
const isToday = date => date.isSame(moment(mock.NOW), "day");

export default function timeLeftForWorkInMs(
  events,
  { workStartTime, workEndTime, fromTime }
) {
  // if we are supposed to calculate work time only for today
  if (isToday(workStartTime) && isToday(workEndTime)) {
    return timeLeftForWorkTodayInMs(events, {
      workStartTime,
      workEndTime,
      fromTime
    });
  } else {
    // TODO: remove hard coded value of now
    let dayCursor;
    if (moment.isMoment(fromTime)) {
      dayCursor = fromTime.dayOfYear() + 1;
    } else {
      dayCursor = moment(mock.NOW).dayOfYear() + 1;
    }

    let workTimeForDateRange = [];

    while (
      moment()
        .dayOfYear(dayCursor - 1)
        .isBefore(workEndTime, "day")
    ) {
      workTimeForDateRange.push(
        timeLeftForWorkTodayInMs(events, {
          workStartTime: moment()
            .dayOfYear(dayCursor)
            .hours(workDayTiming.start.hours)
            .minutes(workDayTiming.start.minutes),
          workEndTime: moment()
            .dayOfYear(dayCursor)
            .hours(workDayTiming.end.hours)
            .minutes(workDayTiming.end.minutes),
          fromTime: moment()
            .dayOfYear(dayCursor)
            .hours(workDayTiming.start.hours)
            .minutes(workDayTiming.start.minutes)
        })
      );
      dayCursor += 1;
    }

    workTimeForDateRange.push(
      timeLeftForWorkTodayInMs(events, {
        //  TODO: remove mocked value of now
        workStartTime: moment(mock.NOW)
          .hours(workDayTiming.start.hours)
          .minutes(workDayTiming.start.minutes),
        //  TODO: remove mocked value of now
        workEndTime: moment(mock.NOW)
          .hours(workDayTiming.end.hours)
          .minutes(workDayTiming.end.minutes)
      })
    );

    return workTimeForDateRange.reduce((a, b) => a + b, 0);
  }
}
