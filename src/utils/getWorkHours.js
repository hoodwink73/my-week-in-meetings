import moment from "moment";
import mock from "../mock";

export default function getWorkHours(forWeek = false) {
  // TODO: Remove the hard coded value here
  // this has to be set by user and we need to have default
  // value to start with
  const workDayTiming = {
    start: mock.WORK_START_TIME,
    end: mock.WORK_END_TIME
  };

  let workStartTime = moment()
    .hours(workDayTiming.start.hours)
    .minutes(workDayTiming.start.minutes);

  let workEndTime = moment()
    .hours(workDayTiming.end.hours)
    .minutes(workDayTiming.end.minutes);

  if (forWeek) {
    workStartTime = workStartTime.day("Monday");
    workEndTime = workEndTime.day("Friday");
  }

  return {
    workStartTime,
    workEndTime
  };
}
