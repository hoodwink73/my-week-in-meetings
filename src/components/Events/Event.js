import React, { useCallback, useState, memo } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
import moment from "moment";
import firebase from "@firebase/app";
import "@firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import useMedia from "react-use/lib/useMedia";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import Button from "../Button";
import DeclineMeetingGuide from "../DeclineMeetingGuide";

const dateFormatString = "kk : mm";

const formatDateTime = dateTimeString =>
  moment(dateTimeString).format(dateFormatString);

export default function Event({ data, isHappeningNow, readOnly }) {
  const { user } = useAuthState(firebase.auth());
  const isLarge = useMedia("(min-width: 64em)");
  const [isDeclineMeetingGuideOpen, openDeclineMeetingGuide] = useState(false);

  const isEventOrganisedByUser = data.organizer.email === user.email;
  // this state determines whether we want to allow user to
  // decline an event
  // these are the circumstances under which a user cannot decline an vent
  // -  the event is already happening
  // -  the event was organised by the user themself
  const isActive = !isHappeningNow && !isEventOrganisedByUser;

  const handleToggleDeclineMeetingGuide = useCallback(() => {
    openDeclineMeetingGuide(!isDeclineMeetingGuideOpen);
  }, [isDeclineMeetingGuideOpen]);

  const highlightEventStyle = ({ colors }) => css`
    border-radius: 10px;

    ${!isActive &&
      `
      color: ${colors.neutrals[3]};
    `}

    ${isLarge ? "&:hover" : "&"} {
      ${(isActive || !isLarge) &&
        !readOnly &&
        `box-shadow: 0px 0px 0px 2px
        ${isActive ? colors.primary[2] : colors.neutrals[3]};`}
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
    <>
      <Box key={data.id} mb={[4, 1]} css={highlightEventStyle}>
        <Flex justifyContent="space-between" px={2} py={3}>
          <Flex
            flexDirection="column"
            justifyContent={["space-between", "flex-start"]}
            pl={2}
          >
            {isHappeningNow ? (
              <Text
                fontSize={1}
                fontWeight="bold"
                textAlign="center"
                borderRadius={10}
                p={1}
                mb={2}
                bg="neutrals.1"
                color="neutrals.4"
              >
                NOW
              </Text>
            ) : (
              <Text width={[1]} fontWeight="bold" fontSize={2} mb={2}>
                {formatDateTime(data.start.dateTime)}
              </Text>
            )}
            <Text width={[1]} fontWeight="bold" fontSize={2}>
              {formatDateTime(data.end.dateTime)}
            </Text>
          </Flex>
          <Box width={[3 / 4, 4 / 5]}>
            <Text fontSize={[2, 3]} fontWeight="bold" mb={1}>
              {data.summary}
            </Text>

            <Flex flexDirection={["column", "row"]}>
              <Text fontSize={1} color={isActive ? "gray.3" : "neutrals.3"}>
                {"organised by"}
              </Text>
              <Text
                fontSize={1}
                color={isActive ? "gray.3" : "neutrals.3"}
                fontWeight="bold"
                ml={[0, 1]}
              >
                {isEventOrganisedByUser ? "you" : data.organizer.email}
              </Text>
            </Flex>
          </Box>
        </Flex>

        {!readOnly && isActive && (
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
            <Button
              type="primary"
              size="small"
              onClick={handleToggleDeclineMeetingGuide}
            >
              Learn More
            </Button>
          </Card>
        )}
      </Box>

      {!readOnly && isDeclineMeetingGuideOpen && (
        <DeclineMeetingGuide
          event={data}
          isOpen={isDeclineMeetingGuideOpen}
          onRequestClose={handleToggleDeclineMeetingGuide}
        />
      )}
    </>
  );
}

Event.prototype = {
  data: PropTypes.object.isRequired,
  isHappeningNow: PropTypes.bool
};

Event.defaultProps = {
  isHappeningNow: false,
  readOnly: false
};
