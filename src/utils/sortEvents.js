import moment from "moment";
import delve from "dlv";

export default function sortEvents(
  events,
  { ascending = true, key = "start.dateTime" } = {}
) {
  const _events = events.slice();
  return _events.sort((eventA, eventB) => {
    if (ascending) {
      return (
        moment(delve(eventA, key)).valueOf() -
        moment(delve(eventB, key)).valueOf()
      );
    } else {
      return (
        moment(delve(eventB, key)).valueOf() -
        moment(delve(eventA, key)).valueOf()
      );
    }
  });
}
