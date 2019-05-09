import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey } from "../../utils";
import { DAYS_OF_WEEKS } from "../../constants";

const KEY_FOR_AGGREGATED_DATA = "eventsFrequencyByDayOfWeek";

export default function BusiestDay({ data, ...props }) {
  let noDataAvailable = false;
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

  return (
    <Card
      width={[1, "calc(50% - 8px)"]}
      mb={[3, 0]}
      borderRadius={5}
      bg="white.0"
      boxShadow="medium"
      p={[3]}
      mx={[0]}
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
          Busiest Day of The Week
        </Text>

        <Text mt={3} fontSize={1} fontWeight="bold" color="gray.2">
          On which day of the week you have the most number of meetings
        </Text>

        <Text mt="auto" fontSize={6} fontWeight="bold" color="gray.4">
          {noDataAvailable ? "No Data" : busiestDay}
        </Text>
      </Flex>
    </Card>
  );
}

BusiestDay.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.props
};
