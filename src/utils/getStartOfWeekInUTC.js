import dayjs from "dayjs";

export default function getStartOfWeekInUTC() {
  return dayjs()
    .startOf("week")
    .toISOString();
}
