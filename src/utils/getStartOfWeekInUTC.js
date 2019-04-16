import moment from "moment";

export default function getStartOfWeekInUTC() {
  return moment()
    .startOf("isoWeek")
    .toISOString();
}
