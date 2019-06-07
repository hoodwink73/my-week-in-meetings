import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import delve from "dlv";
import moment from "moment";
import Tooltip, { useTooltip, TooltipPopup } from "@reach/tooltip";

import { getWorkHours } from "../../utils";
import { UserConfigContext } from "../UserConfig";
import AggregatedDataPropType from "./AggregatedData.propType";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
import { ReactComponent as InfoIcon } from "../../icons/icon-information.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const WEEKS_TO_AGGREGATE_OVER = 4;
const KEY_FOR_AGGREGATED_DATA = "aggregateTotalMeetingTime";

const CardInfo = ({ ...props }) => (
  <Tooltip label="This data is calculated over last four weeks">
    <InfoIcon width={16} {...props} />
  </Tooltip>
);

const CardIcon = ({ width, ...props }) => (
  <Box
    width={width}
    bg="primary.1"
    css={css`
      text-align: center;
      height: ${width}px;
      border-radius: 50%;
      padding: 8px;
    `}
    {...props}
  >
    <MeetingIcon
      css={theme => css`
        path {
          fill: ${theme.colors.primary[5]};
        }
      `}
    />
  </Box>
);

const CardTitle = ({ ...props }) => (
  <Text width={1} fontSize={5} fontWeight="bold" color="neutrals.6" {...props}>
    Time Spent in Meeting
  </Text>
);

const TotalTimeSpentInMeetings = ({ metric, ...props }) => (
  <Text width={1} fontSize={5} fontWeight="bold" color="neutrals.7" {...props}>
    {metric} hrs
  </Text>
);

const TimeInMeetinsRelativeToWorkInPercent = ({ metric, ...props }) => (
  <Text width={1} fontSize={5} fontWeight="bold" color="neutrals.7" {...props}>
    {metric}%
  </Text>
);

const Explain = ({ ...props }) => (
  <>
    <Text
      width={3 / 4}
      mt={1}
      fontSize={1}
      fontWeight="bold"
      color="neutrals.5"
      {...props}
    >
      Total time spent in meetings over last four weeks
      <CardInfo
        css={css`
          padding-left: 5px;
          vertical-align: bottom;
        `}
      />
    </Text>
  </>
);

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

  const totalTimeSpentInMeetingsInHours = moment
    .duration(totalTimeSpentInMeetingsInMs)
    .asHours()
    .toFixed(1);

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
      <CardIcon width={64} />

      <Box>
        <CardTitle mt={4} />

        <Flex
          width={1}
          flexWrap="wrap"
          css={css`
            height: 250px;
          `}
        >
          <Explain mt={4} />
          <Box width={1} justifyContent="space-between" alignSelf="flex-end">
            <TotalTimeSpentInMeetings
              metric={totalTimeSpentInMeetingsInHours}
            />

            <TimeInMeetinsRelativeToWorkInPercent
              mt={3}
              metric={timeSpentInMeetingsAsPercent}
            />
          </Box>
        </Flex>
      </Box>
    </Card>
  );
}

TimeSpentInMeetings.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.props
};
