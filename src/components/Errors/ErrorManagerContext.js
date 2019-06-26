import React, { createContext, useReducer, useContext } from "react";

export const ErrorManagerContext = createContext();

const DISMISS_ERROR_AFTER_MS = 5000;

const manageErrorsReducer = (errors, action) => {
  switch (action.type) {
    case "ADD":
      return errors.concat([action.error]);
    case "DISAPPEAR":
    case "DISMISS":
      return errors.filter(error => error.id !== action.id);
    default:
      return errors;
  }
};

export function ErrorManagerContextProvider({ children }) {
  const [errorsState, dispatch] = useReducer(manageErrorsReducer, []);
  return (
    <ErrorManagerContext.Provider value={{ errorsState, dispatch }}>
      {children}
    </ErrorManagerContext.Provider>
  );
}

export function useErrorManager() {
  const { dispatch } = useContext(ErrorManagerContext);

  return {
    registerError(error) {
      // enforce errors to br registered at 2 ms apart
      // so we get unique ids
      setTimeout(() => {
        let uniqueID = Date.now();
        dispatch({
          type: "ADD",
          error: {
            id: uniqueID,
            ...error
          }
        });

        if (error.disappear) {
          setTimeout(
            () =>
              dispatch({
                type: "DISAPPEAR",
                id: uniqueID
              }),
            DISMISS_ERROR_AFTER_MS
          );
        }
      }, 2);
    }
  };
}
