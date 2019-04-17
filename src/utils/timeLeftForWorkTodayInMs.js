import moment from "moment";
import groupEventsByTime from "./groupEventsByTime";
import sortEvents from "./sortEvents";
import mock from "../mock";

export default function timeLeftForWorkTodayInMs(
  events,
  workDayTiming = {
    start: mock.WORK_START_TIME,
    end: mock.WORK_END_TIME
  }
) {
  const { happening, willHappen } = groupEventsByTime(events);
  // TODO: Remove the hard coded value here
  let now = moment(mock.NOW);

  // if the workday hasn't begun, we should only start counting from beginning
  // of the work day
  if (now.isBefore(workStartTime)) {
    now = workStartTime;
  }

  // TODO: Remove the hard coded value here
  const workStartTime = moment(mock.TODAY)
    .hours(workDayTiming.start.hours)
    .minutes(workDayTiming.start.minutes);

  // TODO: Remove the hard coded value here
  let workEndTime = moment(mock.TODAY)
    .hours(workDayTiming.end.hours)
    .minutes(workDayTiming.end.minutes);

  let futureEventsDuration = [];

  futureEventsDuration = futureEventsDuration.concat(
    willHappen.map(event => {
      // if there are some events which are happening post workday,
      // lets filter them out
      if (
        moment(event.start.dateTime).isAfter(workEndTime, "minute") ||
        moment(event.start.dateTime).isSame(workEndTime, "minute")
      ) {
        return 0;
      } else if (
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

    now = moment(eventWhichIsTheLastToEnd.end.dateTime);
  }

  // if the workday hasn't begun, we should only start counting from beginning
  // of the work day
  if (now.isBefore(workStartTime)) {
    now = workStartTime;
  }

  const totalTimeLeftForWorkTodayInMs = workEndTime.diff(now, "milliseconds");
  const timeThatWillBeSpentInMeetingsTodayInMs = futureEventsDuration.reduce(
    (sum, current) => sum + current
  );

  return totalTimeLeftForWorkTodayInMs - timeThatWillBeSpentInMeetingsTodayInMs;
}
