import firebase from "@firebase/app";
import "@firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

import useUser from "./useUser";
import { getUserGoogleID } from "../utils";

// this is a realtime subscription to get notified whether we
// have complete aggregation of data for all the past weeks for
// the first time (relevant only for new users during their sign ups)
export default function useDoesUserHaveAggregatedData() {
  const { user } = useUser();
  const googleID = getUserGoogleID(user);

  let hasFirstAggregationCompletedForUser = false;

  const { value, loading, error } = useDocument(
    firebase
      .firestore()
      .collection("users")
      .doc(googleID)
  );

  if (value && value.exists) {
    hasFirstAggregationCompletedForUser = value.data().firstAggregationComplete;
  }

  return {
    value: hasFirstAggregationCompletedForUser,
    loading,
    error
  };
}
