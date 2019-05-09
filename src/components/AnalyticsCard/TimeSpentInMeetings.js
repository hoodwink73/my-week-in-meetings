import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import delve from "dlv";

import { getWorkHours } from "../../utils";
import { UserConfigContext } from "../UserConfig";
import AggregatedDataPropType from "./AggregatedData.propType";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const WEEKS_TO_AGGREGATE_OVER = 4;
const KEY_FOR_AGGREGATED_DATA = "aggregateTotalMeetingTime";

export default function TimeSpentInMeetings({ data, ...props }) {
  const { userConfig } = useContext(UserConfigContext);

  // daily work time
  const { workStartTime, workEndTime } = getWorkHours(false, userConfig);
  const numberOfWorkingDays = userConfig.workingDays.length;
  const totalWorkTimeAvailableInMs =
    workEndTime.diff(workStartTime) *
    numberOfWorkingDays *
    WEEKS_TO_AGGREGATE_OVER;

  const totalTimeSpentInMeetingsInMs = data.reduce(
    (cumulativeMeetingTime, aggregateForAWeek = {}) => {
      return (
        cumulativeMeetingTime +
        delve(aggregateForAWeek, KEY_FOR_AGGREGATED_DATA, 0)
      );
    },
    0
  );

  const timeSpentInMeetingsAsPercent = parseInt(
    (totalTimeSpentInMeetingsInMs / totalWorkTimeAvailableInMs) * 100,
    10
  );

  return (
    <Card
      width={[1, "calc(50% - 8px)"]}
      mb={[3, 0]}
      borderRadius={5}
      bg="white.0"
      boxShadow="medium"
      p={[3]}
      {...props}
    >
      <Flex
        flexDirection="column"
        css={css`
          height: 300px;
        `}
      >
        <Box
          width={50}
          bg="red.0"
          css={css`
            text-align: center;
            height: 50px;
            border-radius: 50%;
          `}
        >
          <MeetingIcon
            css={theme => css`
              padding-top: 10px;
              width: 30px;
              path {
                fill: ${theme.colors.red[2]};
              }
            `}
          />
        </Box>

        <Text mt={4} fontSize={3} fontWeight="bold">
          Time Spent in Meeting
        </Text>

        <Text mt={3} fontSize={1} fontWeight="bold" color="gray.2">
          How much relative time have you spent in meetings last month
        </Text>

        <Text mt="auto" fontSize={6} fontWeight="bold" color="gray.4">
          {timeSpentInMeetingsAsPercent}%
        </Text>
      </Flex>
    </Card>
  );
}

TimeSpentInMeetings.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.props
};
