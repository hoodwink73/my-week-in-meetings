import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey, getUserDomain } from "../../utils";

const KEY_FOR_AGGREGATED_DATA = "eventCreatorByDomainsFrequency";

export default function MeetingsByDomains({ data, ...props }) {
  const { user } = useAuthState(firebase.auth());
  const userDomain = getUserDomain(user);
  let noDataAvailable = false;
  // accumulated over last few weeks
  let sortedMeetingsByDomains = sortCollectionByKey(
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
  if (!sortedMeetingsByDomains.size) {
    noDataAvailable = true;
  } else {
    var internalVsExternal = {
      internal: 0,
      external: 0
    };

    for (let [domain, numberOfMeetings] of sortedMeetingsByDomains) {
      if (domain === userDomain) {
        internalVsExternal.internal += numberOfMeetings;
      } else {
        internalVsExternal.external += numberOfMeetings;
      }
    }
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
          Inside/Outside the Organisation
        </Text>

        <Text mt={3} fontSize={1} fontWeight="bold" color="gray.2">
          Meetings from organisers inside versus outside the organisation
        </Text>

        <Text mt="auto" fontSize={6} fontWeight="bold" color="gray.4">
          {noDataAvailable ? (
            "No Data"
          ) : (
            <Flex>
              <Text color="">{internalVsExternal.external}</Text> /{" "}
              <Text color="">{internalVsExternal.internal}</Text>
            </Flex>
          )}
        </Text>
      </Flex>
    </Card>
  );
}

MeetingsByDomains.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.propTypes
};
