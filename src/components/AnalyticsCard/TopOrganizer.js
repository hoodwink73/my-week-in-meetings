import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey } from "../../utils";

const KEY_FOR_AGGREGATED_DATA = "rankCollaborators";

export default function TopOrganizer({ data, ...props }) {
  let noDataAvailable = false;
  // accumulated over last few weeks
  let sortedMeetingTimeByOrganizers = sortCollectionByKey(
    data.reduce((acc, aggregateForOneWeek) => {
      const eventsByOrganizers =
        aggregateForOneWeek && aggregateForOneWeek[KEY_FOR_AGGREGATED_DATA];
      if (eventsByOrganizers) {
        return acc.concat([eventsByOrganizers]);
      } else {
        return acc;
      }
    }, []),
    "desc"
  );

  // the person who invited me to most meetings
  if (!sortedMeetingTimeByOrganizers.size) {
    noDataAvailable = true;
  } else {
    var [topOrganizerEmail] = sortedMeetingTimeByOrganizers.keys();
    var [numberOfMeetings] = sortedMeetingTimeByOrganizers.values();
  }

  return (
    <Card
      width={[1, "calc(50% - 8px)"]}
      mb={[3, 0]}
      p={[3]}
      borderRadius={5}
      bg="white.0"
      boxShadow="medium"
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
          Most Invited By
        </Text>

        <Text mt={3} fontSize={1} fontWeight="bold" color="gray.2">
          Who invited you to most number of meetings over last month
        </Text>

        {noDataAvailable ? (
          <Text mt="auto" fontSize={6} fontWeight="bold" color="gray.4">
            No Data
          </Text>
        ) : (
          <Flex mt="auto" justifyContent="space-between">
            <Box>
              <Text fontSize={6} fontWeight="bold">
                {numberOfMeetings}
              </Text>
            </Box>
            <Box alignSelf="flex-end">
              <Text mb={1} textAlign="right">
                organised by
              </Text>
              <Text fontWeight="bold" textAlign="right">
                {topOrganizerEmail}
              </Text>
            </Box>
          </Flex>
        )}
      </Flex>
    </Card>
  );
}

TopOrganizer.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.propTypes
};
