import moment from "moment";

import sortEvents from "./sortEvents";

export default function timeInOverlappedMeetingsInMs(events) {
  const timeOverlappedBy = [];
  const sortedEvents = sortEvents(events);

  sortedEvents.reduce((prevEvent, event) => {
    const prevEventEndTime = moment(prevEvent.end.dateTime);
    const thisEventStartTime = moment(event.start.dateTime);
    if (prevEventEndTime.isAfter(thisEventStartTime, "minute")) {
      timeOverlappedBy.push(
        prevEventEndTime.diff(thisEventStartTime, "milliseconds")
      );
    }
    return event;
  });

  return timeOverlappedBy.reduce((a, b) => a + b, 0);
}
