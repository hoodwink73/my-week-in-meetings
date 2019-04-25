import moment from "moment";

export default function getStartOfWeekInUTC(weeksBefore = 0) {
  return moment()
    .subtract(weeksBefore, "weeks")
    .startOf("isoWeek")
    .toISOString();
}
