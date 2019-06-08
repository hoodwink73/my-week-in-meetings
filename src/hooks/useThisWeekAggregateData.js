import firebase from "@firebase/app";
import "@firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

import useUser from "./useUser";
import { getStartOfWeekInUTC, getUserGoogleID } from "../utils";

const getAggregatedDataForWeek = (week, googleID) => {
  return firebase.firestore().doc(`users/${googleID}/aggregates/${week}`);
};

// this is a realtime subscription of getting this week's aggregate data
// currently it is only used as a proxy to detect whether this is a new user
// has signed up
// note - we are not using this for our analytics card
// we have a different hook for that
export default function useThisWeekAggregateData() {
  const { user } = useUser();
  const googleID = getUserGoogleID(user);

  const { value, loading, error } = useDocument(
    getAggregatedDataForWeek(getStartOfWeekInUTC(), googleID)
  );

  return {
    value,
    loading,
    error
  };
}
