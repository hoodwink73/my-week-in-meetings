import React, { useState, useEffect } from "react";
import ASQ from "asynquence";
import firebase from "@firebase/app";
import "@firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

import { getStartOfWeekInUTC } from "../utils";

const getAggregatedDataForWeek = (week, googleID) => {
  return firebase
    .firestore()
    .doc(`users/${googleID}/aggregates/${week}`)
    .get();
};

const LAST_WEEKS_TO_FETCH = 3;

// this custom hook abstracts the loading of aggregated events
// for several weeks from Firestore
export default function useAggregatedEventData(googleID) {
  // this state has some idiosyncracies
  // it represents two async sequences
  // the first sequence will get the aggregrated events data for **this** week
  // the second sequence will get the aggregated events data for **last** weeks
  // this is primarily done beacuse some cards only depends on **this** week's
  // data and some depend on both **this** week and last weeks data
  // I want the cards which depends on only **this** week's data to be not
  // blocked by the request's of last weeks' data
  const [results, setResults] = useState({
    // this is tuple of two elements
    // the first element represents *loading* of this week's data
    // the second element represents *loading* of last few weeks' data
    loading: [],
    error: null,
    // the first element represents **this** week's data
    // and will be pushed to the array as soon as it is available
    // without any waiting for the data of the last few weeks
    // the rest of the elements will be pushed all at once
    // they represent in order (from last week to older week) the data
    // for last few weeks
    data: []
  });

  const { value: thisWeekAggregateLive } = useDocument(
    firebase
      .firestore()
      .doc(`users/${googleID}/aggregates/${getStartOfWeekInUTC()}`)
  );

  // these are timestamp representing the beginning of the week
  // expressed as ISO stings
  var lastWeeks = [...Array(LAST_WEEKS_TO_FETCH + 1).keys()]
    .slice(1)
    .map(getStartOfWeekInUTC);

  useEffect(() => {
    const aggregateDataForLastThreeWeeksReq = currentWeekData =>
      ASQ()
        .all(
          ...lastWeeks.map(week =>
            ASQ().promise(getAggregatedDataForWeek(week, googleID))
          )
        )
        .val(function(...lastThreeWeeksAggregate) {
          return [currentWeekData, ...lastThreeWeeksAggregate];
        });

    ASQ()
      .val(() => {
        setResults({ ...results, loading: [true, true] });
      })
      .promise(getAggregatedDataForWeek(getStartOfWeekInUTC(), googleID))
      .val(doc => {
        let thisWeekAggregate = null;
        if (doc.exists) {
          thisWeekAggregate = doc.data();
          setResults({
            ...results,
            loading: [false, true],
            data: [thisWeekAggregate]
          });
        } else {
          setResults({
            ...results,
            loading: [false, true],
            data: [thisWeekAggregate]
          });
        }

        return thisWeekAggregate;
      })
      .seq(aggregateDataForLastThreeWeeksReq)
      .val(([currentWeekData, ...lastWeeksDataResponse]) => {
        var dataForLastThreeWeeks = lastWeeksDataResponse.map(result => {
          if (result.exists) {
            return result.data();
          } else {
            return null;
          }
        });

        setResults(() => {
          return {
            error: null,
            loading: [false, false],
            data: [currentWeekData, ...dataForLastThreeWeeks]
          };
        });
      })
      .or(err => {
        setResults({
          ...results,
          loading: [false, false],
          error: {
            status: true,
            message: err
          }
        });
      });
  }, []);

  useEffect(() => {
    // update aggregate value for this week
    if (results.data.length === LAST_WEEKS_TO_FETCH + 1) {
      setResults({
        ...results,
        data: [thisWeekAggregateLive.data(), ...results.data.slice(1)]
      });
    }
  }, [thisWeekAggregateLive]);
  return results;
}
