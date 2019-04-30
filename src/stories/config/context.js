import { FirestoreDataContext } from "../../components/FirestoreData";
import { UserConfigContext } from "../../components/UserConfig";

import events from "./events/2019-04-01";
export const contexts = [
  {
    icon: "box", // a icon displayed in the Storybook toolbar to control contextual props
    title: "Events Data", // an unique name of a contextual environment
    components: [FirestoreDataContext.Provider, UserConfigContext.Provider],
    params: [
      // an array of params contains a set of predefined `props` for `components`
      {
        name: "No events",
        props: {
          value: {
            eventsThisWeek: { loading: false, error: null, data: [] },
            userConfig: {
              workStartTime: { hours: 9, minutes: 0 },
              workEndTime: { hours: 21, minutes: 0 },
              workingDays: [1, 2, 3, 4, 5]
            },
            aggregatedEvents: {
              error: null,
              loading: [false, false],
              data: [null, null, null]
            }
          }
        }
      },
      {
        name: "Events for 1st Week of April (2019-03-31T18:30:00.000Z)",
        props: {
          value: {
            eventsThisWeek: { loading: false, error: null, data: events },
            userConfig: {
              workStartTime: { hours: 9, minutes: 0 },
              workEndTime: { hours: 21, minutes: 0 },
              workingDays: [1, 2, 3, 4, 5]
            },
            aggregatedEvents: {
              error: null,
              loading: [false, false],
              data: []
            }
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
