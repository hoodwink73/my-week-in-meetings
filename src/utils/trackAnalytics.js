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
      mixpanel.identify(userID);

      track({
        mixpanel: {
          eventName: "user authenticated"
        }
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

const sendUserRoleToMixpanel = ({ userID, role }) => {
  if (isAnalyticsTurnedOn()) {
    const { mixpanel } = window;

    if (!mixpanel) {
      return;
    }

    try {
      mixpanel.people.set({
        role
      });
      mixpanel.identify(userID);
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

    if (!"hitType" in detailsToTrack) {
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
track.sendUserRoleToMixpanel = sendUserRoleToMixpanel;

export default track;
