import moment from "moment";

export const DAYS_OF_WEEKS = [...Array(7).keys()].map(index =>
  moment()
    .isoWeekday(index)
    .format("dddd")
);
