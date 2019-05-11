import moment from "moment";

export const DAYS_OF_WEEKS = [...Array(7).keys()].map(index =>
  moment()
    .isoWeekday(index)
    .format("dddd")
);

export const DEFAULT_WORKING_TIME = {
  workStartTime: { hours: 9, minutes: 0 },
  workEndTime: { hours: 21, minutes: 0 },
  workingDays: [1, 2, 3, 4, 5]
};

export const EVENT_STATUSES = new Map([
  ["Accepted", "accepted"],
  ["Maybe", "tentative"],
  ["Declined", "declined"],
  ["Not Responded", "needsAction"]
]);
