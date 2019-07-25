import React, { useContext, useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { useTransition, animated } from "react-spring";

import { FirestoreDataContext } from "../FirestoreData";
import { UserConfigContext } from "../UserConfig";
import Time from "../Time";
import Progress from "../Progress";
import { useBeat } from "../../hooks";
import {
  filterEventsForToday,
  timeLeftForWorkInMs,
  getWorkHours,
  getDayStatus,
  pluralize
} from "../../utils";

import { DAY_STATUSES } from "../../constants";

const IN_PROGRESS_TEXT_OPTIONS = ["build", "make", "create", "get work done"];

let AnimateText = () => {
  const [animateText, setAnimatetext] = useState([
    { key: 0, text: IN_PROGRESS_TEXT_OPTIONS[0] }
  ]);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (animateText[0].key < IN_PROGRESS_TEXT_OPTIONS.length - 1) {
        setAnimatetext([
          {
            key: animateText[0].key + 1,
            text: IN_PROGRESS_TEXT_OPTIONS[animateText[0].key + 1]
          }
        ]);
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [animateText]);

  const transitions = useTransition(animateText, item => item.key, {
    from: {
      position: "absolute",
      transform: "translate3d(0,-40px,0)",
      opacity: 0
    },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: { opacity: 0 }
  });

  return transitions.map(({ item, props, key }) => (
    <animated.span key={key} style={props}>
      {item.text}
    </animated.span>
  ));
};

export default function TimeLeftForWork({ selectedTimeRange, ...props }) {
  useBeat();

  const { eventsThisWeek: eventsThisWeekRequest } = useContext(
    FirestoreDataContext
  );

  const { userConfig } = useContext(UserConfigContext);

  const eventsThisWeek = eventsThisWeekRequest.data;

  if (eventsThisWeekRequest.loading) {
    return "Loading";
  }

  if (eventsThisWeekRequest.error) {
    console.error(eventsThisWeek.error);
    return null;
  }

  let eventsForToday = filterEventsForToday(eventsThisWeek);
  let events;
  let showDataForWeek;

  switch (selectedTimeRange) {
    case "week":
      showDataForWeek = true;
      break;
    case "today":
    case "default":
      showDataForWeek = false;
  }

  const { workStartTime, workEndTime } = getWorkHours(showDataForWeek, {
    ...userConfig
  });

  if (showDataForWeek) {
    events = eventsThisWeek;
  } else {
    events = eventsForToday;
  }

  // this is excluding the total meeting time
  const totalTimeAvailableForWorkFromStartTime = timeLeftForWorkInMs(
    events,
    {
      workStartTime,
      workEndTime,
      fromTime: workStartTime
    },
    userConfig
  );

  // from right now, how much time I have left for work
  // this is excluding the meetings I have to take in the recent future
  // until my workday ends
  const timeLeftFromThisInstant = timeLeftForWorkInMs(
    events,
    {
      workStartTime,
      workEndTime
    },
    userConfig
  );

  const timeElapsedDoingWorkInPercentage =
    totalTimeAvailableForWorkFromStartTime === 0
      ? 100
      : ((totalTimeAvailableForWorkFromStartTime - timeLeftFromThisInstant) /
          totalTimeAvailableForWorkFromStartTime) *
        100;

  let Content;
  const textProps = {
    fontSize: [1, 4],
    color: "primary.7",
    fontWeight: "bold",
    textAlign: "center"
  };

  switch (getDayStatus(userConfig)) {
    case DAY_STATUSES.get("NO_WORK_TODAY"):
      Content = () => <Text {...textProps}>Its a spa day today!</Text>;
      break;
    case DAY_STATUSES.get("YET_TO_BEGIN"):
      Content = () => (
        <Text
          {...textProps}
        >{pluralize`Namaste! Today is going to be fabulous.`}</Text>
      );
      break;
    case DAY_STATUSES.get("ENDED"):
      Content = () => (
        <Text {...textProps}>Take rest. You did well today.</Text>
      );
      break;
    case DAY_STATUSES.get("IN_PROGRESS"):
    default:
      Content = () => (
        <Text {...textProps}>
          <Time timeInMs={timeLeftFromThisInstant} as="span" />
          <span> left today to</span>
        </Text>
      );
  }

  return (
    <Box
      bg="primary.0"
      px={2}
      py={3}
      css={css`
        border-radius: 25px;
      `}
      {...props}
    >
      <Flex justifyContent="center" alignItems={["center", "flex-start"]}>
        <Progress
          percent={timeElapsedDoingWorkInPercentage}
          width={[16, 32]}
          mt={[1, 0]}
          mr={[2, 3]}
        />
        <Content />
        {getDayStatus(userConfig) === DAY_STATUSES.get("IN_PROGRESS") && (
          <Text
            {...textProps}
            css={css`
              position: relative;
              width: 12ch;
              height: 1.2em;
              display: inline-block;
              margin-left: 4px;
              span {
                height: 1em;

                left: 0;
              }
            `}
          >
            <AnimateText />
          </Text>
        )}
      </Flex>
    </Box>
  );
}

TimeLeftForWork.propTypes = {
  selectedTimeRange: PropTypes.oneOf(["today", "week"]),
  ...Box.propTypes
};
