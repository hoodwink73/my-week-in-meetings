import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Button } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

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
    <Modal isOpen={isOpen} onRequestClose={onToggle}>
      <Flex width={[1, 600]} px={[4, 0]} m="auto" flexDirection="column">
        <Text
          fontFamily="sans"
          fontSize={4}
          fontWeight="bold"
          width={3 / 4}
          my={4}
        >
          Settings
        </Text>

        <Flex justifyContent="space-between" mb={2}>
          <Text fontWeight="bold" fontSize={2}>
            Work Day Begins At
          </Text>
          <Flex>
            <Box>
              <Input
                value={workingTime.workStartTime.hours}
                onChange={changeWorkStartTimeHours}
                timeUnit="hours"
              />
            </Box>
            <Text px={2}>:</Text>
            <Box>
              <Input
                value={workingTime.workStartTime.minutes}
                onChange={changeWorkStartTimeMinutes}
                timeUnit="minutes"
              />
            </Box>
          </Flex>
        </Flex>

        <Flex justifyContent="space-between">
          <Text fontWeight="bold" fontSize={2}>
            Work Day Ends At
          </Text>
          <Flex>
            <Box>
              <Input
                value={workingTime.workEndTime.hours}
                onChange={changeWorkEndTimeHours}
                timeUnit="hours"
              />
            </Box>
            <Text px={2}>:</Text>
            <Box>
              <Input
                value={workingTime.workEndTime.minutes}
                onChange={changeWorkEndTimeMinutes}
                timeUnit="minutes"
              />
            </Box>
          </Flex>
        </Flex>

        <Button
          mt={4}
          mx={["auto", 0]}
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
