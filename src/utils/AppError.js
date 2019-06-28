import { ERRORS } from "../constants";

export default class AppError extends Error {
  constructor(name = "AppError", ...params) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    if (ERRORS.has(name)) {
      super(ERRORS.get(name), ...params);
    } else {
      super(...params);
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.name = name;
    this.happened = new Date();
  }
}
