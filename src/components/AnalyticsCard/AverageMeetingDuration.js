import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import delve from "dlv";
import moment from "moment";
import Tooltip, { useTooltip, TooltipPopup } from "@reach/tooltip";

import AggregatedDataPropType from "./AggregatedData.propType";
import { useUpdateMixpanelUser } from "../../hooks";
import { ReactComponent as TimeSpentIcon } from "../../icons/hourglass-icon.svg";
import { ReactComponent as InfoIcon } from "../../icons/icon-information.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const WEEKS_TO_AGGREGATE_OVER = 4;
const KEY_FOR_AGGREGATED_DATA = "aggregateMeetingDurations";

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
      padding: 12px;
    `}
    {...props}
  >
    <TimeSpentIcon
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
    Meeting Duration
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
      Average duration of your meetings over last four week
      {/* <CardInfo
        css={css`
          padding-left: 5px;
          vertical-align: bottom;
        `}
      /> */}
    </Text>
  </>
);

export default function AverageMeetingDuration({ data, ...props }) {
  const sum = arr => arr.reduce((a, b) => a + b, 0);

  const durationForAllEventsInMs = data.reduce(
    (allEvents, aggregateForAWeek = {}) => {
      return allEvents.concat(
        delve(aggregateForAWeek, KEY_FOR_AGGREGATED_DATA, [])
      );
    },
    []
  );

  const averageMeetingTimeForEventsInMs =
    durationForAllEventsInMs.length > 0
      ? sum(durationForAllEventsInMs) / durationForAllEventsInMs.length
      : 0;

  const averageMeetingTimeForAllWeeksInMinutes = moment
    .duration(averageMeetingTimeForEventsInMs)
    .asMinutes()
    .toFixed(0);

  useUpdateMixpanelUser({
    "average meeting time": averageMeetingTimeForAllWeeksInMinutes
  });

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
            <Text
              width={1}
              fontSize={5}
              fontWeight="bold"
              color="neutrals.7"
              {...props}
            >
              {averageMeetingTimeForAllWeeksInMinutes} mins
            </Text>
          </Box>
        </Flex>
      </Box>
    </Card>
  );
}

AverageMeetingDuration.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.props
};
