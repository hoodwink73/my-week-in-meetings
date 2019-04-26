import moment from "moment";
import mock from "../mock";

// we are relying on the shape of a calendar event
// you can find the documentation here
// https://developers.google.com/calendar/v3/reference/events
export default function filterEventsForToday(events) {
  return events.filter(event => {
    return moment(event.start.dateTime).isSame(moment(), "day");
  });
}
