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
    Internal vs External Meetings
  </Text>
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
    How many meetings were organised within your company and how many without
  </Text>
);

const NoDataAvailable = ({ ...props }) => (
  <Text mt="auto" fontSize={2} fontWeight="bold" color="neutrals.4" {...props}>
    No Data
  </Text>
);

const MeetingsInsideVersusOutside = ({ data, ...props }) => (
  <Flex justifyContent="space-between" {...props}>
    <Box>
      <Text
        fontSize={5}
        color="neutrals.7"
        fontWeight="bold"
        textAlign="center"
      >
        {data.internal}
      </Text>
      <Text color="neutrals.5" fontSize={1} fontWeight="bold">
        Internal
      </Text>
    </Box>

    <Box alignSelf="center">
      <Text fontSize={1} fontWeight="bold" color="neutrals.5">
        vs
      </Text>
    </Box>

    <Box>
      <Text
        color="neutrals.7"
        fontSize={5}
        fontWeight="bold"
        textAlign="center"
      >
        {data.external}
      </Text>
      <Text color="neutrals.5" fontSize={1} fontWeight="bold">
        External
      </Text>
    </Box>
  </Flex>
);

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
      <CardIcon width={64} />

      <Flex flexDirection="column" justifyContent="space-evenly">
        <CardTitle mt={4} />
        {noDataAvailable ? (
          <NoDataAvailable mt={4} />
        ) : (
          <MeetingsInsideVersusOutside
            width={3 / 4}
            mt={4}
            data={internalVsExternal}
          />
        )}
        <Explain mt={4} />
      </Flex>
    </Card>
  );
}

MeetingsByDomains.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.propTypes
};
