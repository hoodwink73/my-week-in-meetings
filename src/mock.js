import moment from "moment";

export default {
  NOW: moment(),
  TODAY: moment(),
  START_OF_WEEK: moment()
    .startOf("isoWeek")
    .toISOString(),
  WORK_START_TIME: { hours: 9, minutes: 0 },
  WORK_END_TIME: { hours: 21, minutes: 0 }
};
