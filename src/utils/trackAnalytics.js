import { TURN_ON_ANALYTICS_FOR_ENVIRONMENT } from "../constants";

const isAnalyticsTurnedOn = () =>
  TURN_ON_ANALYTICS_FOR_ENVIRONMENT.includes(process.env.NODE_ENV);

const sendAuthenticationEventToGoogleAnalytics = ({ userID }) => {
  if (isAnalyticsTurnedOn()) {
    try {
      const { ga } = window;

      if (!ga) {
        return;
      }

      ga("set", "userId", userID);
      ga("send", "event", "authentication", "user-id available");

      // since we do not reload the app after a user logs in
      // we need to explicitly tell GA that user is visiting the app
      // http://bit.ly/2LDxZym
      ga("set", "page", "/app");
      ga("send", "pageview");
    } catch (e) {
      console.error(
        "Could not let Google Analytics know that the user has authenticated",
        e
      );
    }
  }
};

const sendAuthenticationEventToMixpanel = ({ userID }) => {
  if (isAnalyticsTurnedOn()) {
    const { mixpanel } = window;
    if (!mixpanel) {
      return;
    }

    try {
      let EVENT_NAME_TO_TRACK_SESSION = "session";
      mixpanel.identify(userID);

      track({
        mixpanel: {
          eventName: "user authenticated"
        }
      });

      mixpanel.time_event(EVENT_NAME_TO_TRACK_SESSION);

      window.addEventListener("beforeunload", () => {
        const { btoa } = window;

        let startTime =
          mixpanel["persistence"]["props"]["__timers"][
            EVENT_NAME_TO_TRACK_SESSION
          ];
        let duration = new Date().getTime() - startTime;
        //duration is in minutes.
        duration = parseFloat((duration / 1000 / 60).toFixed(3));

        console.log(startTime, duration);
        let data = btoa(
          JSON.stringify({
            event: EVENT_NAME_TO_TRACK_SESSION,
            properties: {
              token: process.env.REACT_APP_MIXPANEL_PROJECT_ID,
              distinct_id: userID,
              $duration: duration,
              ...mixpanel._.info.properties(),
              ...mixpanel["persistence"].properties()
            }
          })
        );

        navigator.sendBeacon(`https://api.mixpanel.com/track/?data=${data}`);
      });
    } catch (e) {
      console.error(
        "Could not let Mixpanel know that the user has authenticated",
        e
      );
    }
  }
};

const activateMixpanel = () => {
  if (isAnalyticsTurnedOn()) {
    const { mixpanel } = window;

    if (!mixpanel) {
      return;
    }

    try {
      mixpanel.init(process.env.REACT_APP_MIXPANEL_PROJECT_ID);
    } catch (e) {
      console.error("Could not initiate mixpanel", e);
    }
  }
};

const activateGoogleAnalytics = () => {
  if (isAnalyticsTurnedOn()) {
    window.ga =
      window.ga ||
      function() {
        (ga.q = ga.q || []).push(arguments);
      };

    const { ga } = window;
    ga.l = +new Date();
    ga("create", process.env.REACT_APP_GOOGLE_ANALYTICS, "auto");
    ga("send", "pageview");
  }
};

const createUserProfileInMixpanel = ({
  userID,
  role,
  email,
  firstName,
  lastName
}) => {
  if (isAnalyticsTurnedOn()) {
    const { mixpanel } = window;

    if (!mixpanel) {
      return;
    }

    try {
      mixpanel.people.set({
        $name: `${firstName} ${lastName}`,
        $firstName: firstName,
        $lastName: lastName,
        $email: email,
        role,
        deleted: false
      });
      mixpanel.identify(userID);
    } catch (e) {
      console.error("Could not send user role to mixpanel", e);
    }
  }
};

const updateUserProfileInMixpanel = (...data) => {
  if (isAnalyticsTurnedOn()) {
    const { mixpanel } = window;

    if (!mixpanel) {
      return;
    }

    try {
      mixpanel.people.append(...data);
    } catch (e) {
      console.error("Could not send user role to mixpanel", e);
    }
  }
};

const trackToGoogleAnalytics = detailsToTrack => {
  if (isAnalyticsTurnedOn()) {
    const { ga } = window;

    if (!ga) {
      return;
    }

    if (!("hitType" in detailsToTrack)) {
      console.error(
        "The event you are trying to track to GA needs a key `hitType`, possibly set to the value `event`"
      );
      return;
    }

    try {
      ga("send", detailsToTrack);
    } catch (e) {
      console.error("Failed to track event to Google Analytics", e);
    }
  }
};

const trackToMixpanel = ({ eventName, ...detailsToTrack }) => {
  if (isAnalyticsTurnedOn()) {
    const { mixpanel } = window;
    if (!mixpanel) {
      return;
    }

    if (!eventName) {
      console.error("Event tracked to mixpanel is missing a name");
      return;
    }

    try {
      mixpanel.track(eventName, detailsToTrack);
    } catch (e) {
      console.error("Failed to track event to Mixpanel", e);
    }
  }
};

const track = ({ ga, mixpanel }) => {
  ga && trackToGoogleAnalytics(ga);
  mixpanel && trackToMixpanel(mixpanel);
};

track.sendAuthenticationEventToGoogleAnalytics = sendAuthenticationEventToGoogleAnalytics;
track.sendAuthenticationEventToMixpanel = sendAuthenticationEventToMixpanel;
track.activateGoogleAnalytics = activateGoogleAnalytics;
track.activateMixpanel = activateMixpanel;
track.createUserProfileInMixpanel = createUserProfileInMixpanel;
track.updateUserProfileInMixpanel = updateUserProfileInMixpanel;

export default track;
