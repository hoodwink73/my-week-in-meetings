import moment from "moment";

export default function getWorkHours(forWeek = false, options) {
  let { workStartTime, workEndTime } = options;

  workStartTime = moment()
    .hours(workStartTime.hours)
    .minutes(workStartTime.minutes);

  workEndTime = moment()
    .hours(workEndTime.hours)
    .minutes(workEndTime.minutes);

  if (forWeek) {
    workStartTime = workStartTime.day("Monday");
    workEndTime = workEndTime.day("Friday");
  }

  return {
    workStartTime,
    workEndTime
  };
}
