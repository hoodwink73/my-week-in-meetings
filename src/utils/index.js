import dayjs from "dayjs";
import en from "dayjs/locale/en";

import getStartOfWeekInUTC from "./getStartOfWeekInUTC";

// work starts on Monday
// we want our week to start on Monday
dayjs.locale({
  ...en,
  weekStart: 1
});

export { getStartOfWeekInUTC };
