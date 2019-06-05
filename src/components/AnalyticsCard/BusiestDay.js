import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { VictoryChart, VictoryAxis, VictoryArea } from "victory";

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
    Busiest Day of the Week
  </Text>
);

const Chart = ({ data, upperLimitRange, ...props }) => (
  <Box width={1} {...props}>
    <VictoryChart
      height={150}
      padding={{ top: 0, bottom: 20, left: 10, right: 10 }}
      domainPadding={{ x: 5 }}
    >
      <VictoryAxis
        style={{
          axis: { stroke: "#fff" },
          tickLabels: {
            fontSize: 15,
            padding: 5
          }
        }}
        tickFormat={tick => {
          return DAYS_OF_WEEKS[Number(tick)][0];
        }}
      />
      <VictoryArea
        style={{ data: { fill: "#47A3F3" } }}
        domain={{ y: [0, upperLimitRange] }}
        interpolation="natural"
        data={data}
        x="day"
        y="duration"
      />
    </VictoryChart>
  </Box>
);

const Explain = ({ ...props }) => (
  <Text
    width={3 / 4}
    mt={1}
    fontSize={1}
    fontWeight="bold"
    color="neutrals.5"
    {...props}
  >
    The day you spend most of your time in meetings
  </Text>
);

const Day = ({ day, ...props }) => (
  <Text mt={4} fontSize={5} fontWeight="bold" color="neutrals.7" {...props}>
    {day}
  </Text>
);

const NoDataAvailable = ({ ...props }) => (
  <Text mt="auto" fontSize={2} fontWeight="bold" color="neutrals.4" {...props}>
    No Data
  </Text>
);

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
      css={css`
        position: relative;
      `}
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

          {noDataAvailable ? (
            <NoDataAvailable mt={4} />
          ) : (
            <Day mt={4} day={busiestDay} />
          )}

          {dataForChart && (
            <Chart
              width={1}
              mt={4}
              data={dataForChart}
              upperLimitRange={upperLimitRange}
            />
          )}
        </Flex>
      </Box>
    </Card>
  );
}

BusiestDay.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.props
};
