import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryArea,
  VictoryGroup
} from "victory";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey } from "../../utils";
import { DAYS_OF_WEEKS } from "../../constants";

const KEY_FOR_AGGREGATED_DATA = "eventsFrequencyByDayOfWeek";

const getDataForChart = sortedData => {
  var result = [];
  for (let [day, duration] of sortedData) {
    result.push({ day, duration: duration / 1000 / 60 });
  }

  result.sort((a, b) => {
    return a.day < b.day ? -1 : 1;
  });

  return result;
};

export default function BusiestDay({ data, ...props }) {
  let noDataAvailable = false;
  let dataForChart = null;
  let upperLimitRange = null;
  // accumulated over last few weeks
  let sortedMeetingTimeByDays = sortCollectionByKey(
    data.reduce((acc, aggregateForOneWeek) => {
      const eventsByday =
        aggregateForOneWeek && aggregateForOneWeek[KEY_FOR_AGGREGATED_DATA];
      if (eventsByday) {
        return acc.concat([eventsByday]);
      } else {
        return acc;
      }
    }, []),
    "desc"
  );

  var busiestDay;
  if (!sortedMeetingTimeByDays.size) {
    noDataAvailable = true;
  } else {
    const [busiestDayIndex] = sortedMeetingTimeByDays.keys();
    busiestDay = DAYS_OF_WEEKS[busiestDayIndex];
  }

  useMemo(() => {
    dataForChart = getDataForChart(sortedMeetingTimeByDays);
    [upperLimitRange] = sortedMeetingTimeByDays.values();
    // we want our y-scale range to be a little greater than
    // the largest y-value, otherwise the chart cuts at the top
    upperLimitRange = upperLimitRange / 1000 / 60 + 60;
  }, [data]);

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
      <Flex flexDirection="column">
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
          Busiest Day of The Week
        </Text>

        <Text mt={3} fontSize={1} fontWeight="bold" color="gray.2">
          On which day of the week you have the most number of meetings
        </Text>

        <Text mt={4} fontSize={5} fontWeight="bold" color="gray.4">
          {noDataAvailable ? "No Data" : busiestDay}
        </Text>

        {dataForChart && (
          <VictoryChart
            height={250}
            padding={{ top: 40, bottom: 40, left: 0, right: 20 }}
            domainPadding={{ x: [10, 0] }}
          >
            <VictoryAxis
              style={{ axis: { stroke: "#fff" } }}
              tickFormat={tick => {
                return DAYS_OF_WEEKS[Number(tick)][0];
              }}
            />
            <VictoryArea
              style={{ data: { fill: "#c43a31" } }}
              domain={{ y: [0, upperLimitRange] }}
              interpolation="natural"
              data={dataForChart}
              x="day"
              y="duration"
            />
          </VictoryChart>
        )}
      </Flex>
    </Card>
  );
}

BusiestDay.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.props
};
