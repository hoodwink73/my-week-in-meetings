import React, { createContext, useReducer, useContext } from "react";

export const ErrorManagerContext = createContext();
export const ErrorDispatcherContext = createContext();

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
    <ErrorManagerContext.Provider value={{ errorsState }}>
      <ErrorDispatcherContext.Provider value={{ dispatch }}>
        {children}
      </ErrorDispatcherContext.Provider>
    </ErrorManagerContext.Provider>
  );
}

export function useErrorManager() {
  const { dispatch } = useContext(ErrorDispatcherContext);

  return {
    registerError({ message, canDismiss = true, disappear = true }) {
      // enforce errors to br registered at 2 ms apart
      // so we get unique ids
      setTimeout(() => {
        let uniqueID = Date.now();
        dispatch({
          type: "ADD",
          error: {
            id: uniqueID,
            message,
            canDismiss
          }
        });

        if (disappear) {
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
