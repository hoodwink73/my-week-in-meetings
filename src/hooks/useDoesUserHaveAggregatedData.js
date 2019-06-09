import firebase from "@firebase/app";
import "@firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import useUser from "./useUser";
import { getUserGoogleID } from "../utils";

// this is a realtime subscription to get notified whether we
// have computed aggregated data for the user
// currently it is used as a proxy to detect whether we have
// finished fetching events for a new user
// we cannot rely on actual number of events since
// we are only fetching events for the last five weeks
// and the user may not have any events during that time
export default function useDoesUserHaveAggregatedData() {
  const { user } = useUser();
  const googleID = getUserGoogleID(user);

  const { value, loading, error } = useCollection(
    firebase
      .firestore()
      .collection(`users/${googleID}/aggregates`)
      // we are limiting the collection size to one
      // to avoid fecthing unnecssary data
      // as this query is just to detect whether the aggregation
      // has been done for the user
      .limit(1)
  );

  return {
    value,
    loading,
    error
  };
}
