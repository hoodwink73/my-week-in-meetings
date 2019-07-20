import React from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import smallBlobInBackground from "../../images/small-blob-variant-3.svg";
import { ReactComponent as BusyIcon } from "../../icons/decline-event-icon.svg";
import { ReactComponent as WakeUpIcon } from "../../icons/wake-up-icon.svg";
import { ReactComponent as WebLessonsIcon } from "../../icons/web-lessons-icon.svg";

const featureItemStyles = {
  width: [1, "35ch"],
  mr: [0, 5],
  px: [0],
  mb: [4, 0],
  flex: "0 1 auto"
};

const featureItemIconStyles = {
  width: 64,
  mx: "auto",
  mb: 4
};

const FeatureIcon = ({ IconComponent, width, ...props }) => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      css={css`
        width: ${2 * width}px;
        height: ${2 * width}px;
        background-image: url(${smallBlobInBackground});
        background-repeat: no-repeat;
        background-size: 70%;
        background-position: center 60%;
      `}
      {...props}
    >
      <Box
        width={width}
        css={css`
          text-align: center;
          height: ${width}px;
        `}
      >
        <IconComponent
          css={theme => css`
            path {
              fill: ${theme.colors.neutrals[8]};
            }
          `}
        />
      </Box>
    </Flex>
  );
};

FeatureIcon.propTypes = {
  IconComponent: PropTypes.elementType.isRequired,
  width: PropTypes.number.isRequired,
  ...Flex.propTypes
};

export default function Features({ ...props }) {
  return (
    <Box {...props}>
      <Flex flexDirection={["column", "row"]} justifyContent="center" width={1}>
        <Box {...featureItemStyles}>
          <FeatureIcon {...featureItemIconStyles} IconComponent={BusyIcon} />
          <Box
            css={css`
              text-align: center;
            `}
          >
            <Text as={"span"} fontSize={3} fontWeight="bold">
              Decline your meetings, politely.
            </Text>
            <Text as={"span"} fontSize={3} ml={1}>
              Take a quiz and get a fitting reply to decline any meeting.
            </Text>
          </Box>
        </Box>

        <Box {...featureItemStyles}>
          <FeatureIcon
            {...featureItemIconStyles}
            IconComponent={WebLessonsIcon}
          />
          <Box
            css={css`
              text-align: center;
            `}
          >
            <Text as={"span"} fontSize={3} fontWeight="bold">
              Become better at meetings with our byte-size lessons.
            </Text>
            <Text as={"span"} fontSize={3} ml={1}>
              We have condensed boring HBR articles into byte size learnings. No
              pun intended.
            </Text>
          </Box>
        </Box>

        <Box {...featureItemStyles}>
          <FeatureIcon {...featureItemIconStyles} IconComponent={WakeUpIcon} />
          <Box
            css={css`
              text-align: center;
            `}
          >
            <Text as={"span"} fontSize={3} fontWeight="bold">
              Gain deeper insights on your meeting habits.
            </Text>
            <Text as={"span"} fontSize={3} ml={1}>
              Get a weekly and monthly overview on your meetings, learn a little
              more about your culture.{" "}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}

Features.propTypes = {
  ...Box.propTypes
};
