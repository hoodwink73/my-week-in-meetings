import moment from "moment";

export default function getWorkHours(forWeek = false, options) {
  let { workStartTime, workEndTime } = options;

  workStartTime = moment()
    .hours(workStartTime.hours)
    .minutes(workStartTime.minutes)
    .seconds(0);

  workEndTime = moment()
    .hours(workEndTime.hours)
    .minutes(workEndTime.minutes)
    .seconds(0);

  if (forWeek) {
    workStartTime = workStartTime.day("Monday");
    workEndTime = workEndTime.day("Friday");
  }

  return {
    workStartTime,
    workEndTime
  };
}
