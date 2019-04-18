import moment from "moment";
import mock from "../mock";

// we are relying on the shape of a calendar event
// you can find the documentation here
// https://developers.google.com/calendar/v3/reference/events
export default function filterEventsForToday(events) {
  return events.filter(event => {
    // TODO: Remove the hard coded date
    // this should just represent today
    return moment(event.start.dateTime).isSame(moment(mock.TODAY), "day");
  });
}