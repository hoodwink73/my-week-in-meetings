import { TURN_ON_ERROR_HANDLING_FOR_ENVIRONMENT } from "../constants";
import * as Sentry from "@sentry/browser";

const reportError = () => {};

reportError.activate = () => {
  if (TURN_ON_ERROR_HANDLING_FOR_ENVIRONMENT.includes(process.env.NODE_ENV)) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN
    });
  }
};

export default reportError;
