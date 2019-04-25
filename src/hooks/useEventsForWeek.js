import firebase from "firebase/app";
import "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { getStartOfWeekInUTC } from "../utils";

export default function(week = 0, googleID) {
  const startOfWeek = getStartOfWeekInUTC(week);
  var { error, loading, value } = useCollection(
    firebase
      .firestore()
      .collection(`users/${googleID}/events`)
      .where("enrichedData.week", "==", startOfWeek)
  );

  var data;
  if (!loading) {
    if (value.exists) {
      data = value.reduce((results, docSnapshot) => {
        results.push(docSnapshot.data());
      }, []);
    } else {
      data = [];
    }
  }

  return {
    loading,
    error,
    data
  };
}
