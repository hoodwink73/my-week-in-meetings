import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import moment from "moment";
import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";

import Button from "../Button";

export default function Events({ events }) {
  const { user } = useAuthState(firebase.auth());
  const isLarge = useMedia("(min-width: 64em)");

  const dateFormatString = "kk : mm";

  const formatDateTime = dateTimeString =>
    moment(dateTimeString).format(dateFormatString);

  const highlightEventStyle = ({ colors }) => css`
    border-radius: 10px;

    ${isLarge ? "&:hover" : "&"} {
      box-shadow: 0px 0px 0px 2px ${colors.primary[2]};
      & > div:nth-child(2) {
        visibility: visible;
      }
    }

    ${isLarge &&
      `
      & > div:nth-child(2) {
        visibility: hidden;
      }
    `}
  `;

  return (
    <Flex flexDirection="column" py={4}>
      {events.length < 1 ? (
        <Text textAlign="center" color="gray.3">
          No upcoming meetings today
        </Text>
      ) : (
        events.map(event => (
          <Box key={event.id} mb={[4, 1]} css={highlightEventStyle}>
            <Flex justifyContent="space-between" px={2} py={3}>
              <Flex flexDirection="column" pl={2}>
                <Text width={[1]} fontWeight="bold" fontSize={2} mb={2}>
                  {formatDateTime(event.start.dateTime)}
                </Text>
                <Text width={[1]} fontWeight="bold" fontSize={2}>
                  {formatDateTime(event.end.dateTime)}
                </Text>
              </Flex>
              <Box width={[3 / 4, 4 / 5]}>
                <Text fontSize={[2, 3]} fontWeight="bold" mb={1}>
                  {event.summary}
                </Text>

                <Flex>
                  <Text fontSize={1} color="gray.3">
                    {"Organised by"}
                  </Text>
                  <Text fontSize={1} color="gray.3" fontWeight="bold" ml={1}>
                    {event.organizer.email === user.email
                      ? "you"
                      : event.organizer.email}
                  </Text>
                </Flex>
              </Box>
            </Flex>
            <Card
              as={Flex}
              justifyContent="space-between"
              mt={3}
              p={2}
              bg="primary.0"
              css={({ colors }) => css`
                border-top: 1px solid ${colors.primary[2]};
                border-radius: 0 0 10px 10px;
              `}
            >
              <Text fontSize={2}> Decline this meeting?</Text>
              <Button type="primary" size="small">
                Learn More
              </Button>
            </Card>
          </Box>
        ))
      )}
    </Flex>
  );
}

Event.propType = {
  event: PropTypes.arrayOf(PropTypes.object).isRequired
};
