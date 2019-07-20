import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import { ReactComponent as MeetingIcon } from "../../icons/meeting.svg";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import AggregatedDataPropType from "./AggregatedData.propType";
import { sortCollectionByKey } from "../../utils";

const KEY_FOR_AGGREGATED_DATA = "rankCollaborators";

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
    Collaborators
  </Text>
);

const Collaborators = ({ count, data, ...props }) => {
  const collaboratorsEmail = Array.from(data.keys()).slice(0, count);
  const meetingsTogetherCount = Array.from(data.values()).slice(0, count);

  return (
    <Box {...props}>
      {collaboratorsEmail.map((email, index) => (
        <Flex key={email} justifyContent="space-between" mb={2}>
          <Text fontSize={2} fontWeight="bold" color="neutrals.7">
            {email}
          </Text>
          <Text fontSize={2} fontWeight="bold" color="neutrals.7">
            {meetingsTogetherCount[index]}
          </Text>
        </Flex>
      ))}
    </Box>
  );
};

const Explain = ({ ...props }) => (
  <Text
    width={3 / 4}
    mt={1}
    fontSize={1}
    fontWeight="bold"
    color="neutrals.5"
    {...props}
  >
    People who you meet most frequently
  </Text>
);

const NoDataAvailable = ({ ...props }) => (
  <Text mt="auto" fontSize={2} fontWeight="bold" color="neutrals.4" {...props}>
    No Data
  </Text>
);

export default function TopCollaborator({ data, ...props }) {
  const { user } = useAuthState(firebase.auth());

  let noDataAvailable = false;
  // accumulated over last few weeks
  let sortedMeetingTimeByOrganizers = sortCollectionByKey(
    data.reduce((acc, aggregateForOneWeek) => {
      let aggregate =
        aggregateForOneWeek && aggregateForOneWeek[KEY_FOR_AGGREGATED_DATA];

      if (aggregate) {
        let eventsByOrganizers = {};
        for (let [email, count] of Object.entries(aggregate)) {
          eventsByOrganizers[email] = count;
        }
        return acc.concat([eventsByOrganizers]);
      } else {
        return acc;
      }
    }, []),
    "desc"
  );

  // filter out events organized by me
  sortedMeetingTimeByOrganizers.delete(user.email);

  if (!sortedMeetingTimeByOrganizers.size) {
    noDataAvailable = true;
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

      <Flex flexDirection="column">
        <CardTitle mt={4} />
        {noDataAvailable ? (
          <NoDataAvailable mt={4} />
        ) : (
          <Flex
            width={1}
            flexWrap="wrap"
            css={css`
              height: 250px;
            `}
          >
            <Explain mt={4} />
            <Collaborators
              width={1}
              alignSelf="flex-end"
              mt={4}
              count={3}
              data={sortedMeetingTimeByOrganizers}
            />
          </Flex>
        )}
      </Flex>
    </Card>
  );
}

TopCollaborator.propTypes = {
  data: PropTypes.arrayOf(AggregatedDataPropType),
  ...Card.propTypes
};
