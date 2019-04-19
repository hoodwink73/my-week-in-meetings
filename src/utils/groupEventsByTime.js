import moment from "moment";
import mock from "../mock";

// TODO: Remove the hard coded value here
export default function(events, now = moment(mock.NOW)) {
  return events.reduce(
    (timeBuckets, event) => {
      if (
        moment(event.start.dateTime).isBefore(now, "minute") &&
        moment(event.end.dateTime).isBefore(now, "minute")
      ) {
        timeBuckets.happened.push(event);
      } else if (
        moment(event.start.dateTime).isAfter(now, "minute") &&
        moment(event.end.dateTime).isAfter(now, "minute")
      ) {
        timeBuckets.willHappen.push(event);
      } else if (
        now.isBetween(
          moment(event.start.dateTime),
          moment(event.end.dateTime),
          "minute"
        )
      ) {
        timeBuckets.happening.push(event);
      }

      return timeBuckets;
    },
    {
      happened: [],
      happening: [],
      willHappen: []
    }
  );
}
