import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";
import leftPad from "left-pad";

import { UserConfigContext } from "../UserConfig";
import Modal from "../Modal";

const Input = ({ value, onChange, timeUnit }) => (
  <input
    type="number"
    min="0"
    max={timeUnit === "hours" ? "23" : "59"}
    steps={timeUnit === "minutes" ? "15" : "1"}
    required
    value={value}
    onChange={onChange}
    css={css`
      font-size: 24px;
      padding: 4px;
    `}
  />
);

export default function SettingsDetails({ isOpen, onToggle }) {
  const { userConfig, setUserConfig, userConfigRequest } = useContext(
    UserConfigContext
  );

  const [workingTime, setWorkingTime] = useState(userConfig);

  const isLarge = useMedia("(min-width: 64em)");

  if (userConfigRequest.error) {
    console.error(userConfigRequest.error);
    return "Error loading config";
  }

  const changeWorkStartTimeHours = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workStartTime: { ...workingTime.workStartTime, hours: value }
    });

  const changeWorkStartTimeMinutes = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workStartTime: { ...workingTime.workStartTime, minutes: value }
    });

  const changeWorkEndTimeHours = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workEndTime: { ...workingTime.workEndTime, hours: value }
    });

  const changeWorkEndTimeMinutes = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workEndTime: { ...workingTime.workEndTime, minutes: value }
    });

  const handleSavingUserConfig = () => {
    setUserConfig(workingTime);
    onToggle();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onToggle}
      contentFit={isLarge}
      mobileMenu={!isLarge}
    >
      <Flex width={[1, 400]} px={[4, 3]} m="auto" flexDirection="column">
        <Text
          fontFamily="sans"
          fontSize={4}
          fontWeight="bold"
          width={3 / 4}
          my={3}
        >
          Settings
        </Text>

        <Flex justifyContent="space-between" mb={2} alignItems="center">
          <Text fontWeight="bold" fontSize={2}>
            Work Day Begins At
          </Text>
          <Flex>
            <Box>
              <Input
                value={leftPad(workingTime.workStartTime.hours, 2, 0)}
                onChange={changeWorkStartTimeHours}
                timeUnit="hours"
              />
            </Box>
            <Text px={2}>:</Text>
            <Box>
              <Input
                value={leftPad(workingTime.workStartTime.minutes, 2, 0)}
                onChange={changeWorkStartTimeMinutes}
                timeUnit="minutes"
              />
            </Box>
          </Flex>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" mb={3}>
          <Text fontWeight="bold" fontSize={2}>
            Work Day Ends At
          </Text>
          <Flex>
            <Box>
              <Input
                value={leftPad(workingTime.workEndTime.hours, 2, 0)}
                onChange={changeWorkEndTimeHours}
                timeUnit="hours"
              />
            </Box>
            <Text px={2} alignSelf="center">
              :
            </Text>
            <Box>
              <Input
                value={leftPad(workingTime.workEndTime.minutes, 2, 0)}
                onChange={changeWorkEndTimeMinutes}
                timeUnit="minutes"
              />
            </Box>
          </Flex>
        </Flex>

        <Button
          bg="gray.3"
          mt={4}
          mx={["auto", 0]}
          my={3}
          width={[3 / 4, 1 / 4]}
          onClick={handleSavingUserConfig}
          css={css`
            cursor: pointer;
          `}
        >
          Save
        </Button>
      </Flex>
    </Modal>
  );
}

SettingsDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
};
