import moment from "moment";

import { DAY_STATUSES } from "../constants";
import getWorkHours from "./getWorkHours";

export default function getDayStatus(userConfig) {
  const now = moment();
  const { workingDays } = userConfig;

  const dayOfWeek = now.day();

  if (workingDays.includes(dayOfWeek)) {
    const { workStartTime, workEndTime } = getWorkHours(false, userConfig);
    if (now.isBetween(workStartTime, workEndTime, "minute", "[]")) {
      return DAY_STATUSES.get("IN_PROGRESS");
    } else if (now.isBefore(workStartTime, "minute")) {
      return DAY_STATUSES.get("YET_TO_BEGIN");
    } else if (now.isAfter(workEndTime, "minute")) {
      return DAY_STATUSES.get("ENDED");
    }
  } else {
    return DAY_STATUSES.get("NO_WORK_TODAY");
  }
}
