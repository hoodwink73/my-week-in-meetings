import { FirestoreDataContext } from "../../components/FirestoreData";
import events from "./events/2019-04-01";
export const contexts = [
  {
    icon: "box", // a icon displayed in the Storybook toolbar to control contextual props
    title: "Events Data", // an unique name of a contextual environment
    components: [FirestoreDataContext.Provider],
    params: [
      // an array of params contains a set of predefined `props` for `components`
      {
        name: "No events",
        props: {
          value: {
            eventsThisWeek: { loading: false, error: null, data: [] }
          }
        }
      },
      {
        name: "Events for 1st Week of April (2019-03-31T18:30:00.000Z)",
        props: {
          value: {
            eventsThisWeek: { loading: false, error: null, data: events }
          }
        }
      }
    ],
    options: {
      deep: true, // pass the `props` deeply into all wrapping components
      disable: false, // disable this contextual environment completely
      cancelable: false // allow this contextual environment to be opt-out optionally in toolbar
    }
  }
  /* ... */ // multiple contexts setups are supported
];
