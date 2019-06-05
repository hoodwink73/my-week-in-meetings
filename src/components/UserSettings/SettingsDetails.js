import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";
import leftPad from "left-pad";

import { useUser } from "../../hooks";
import { UserConfigContext } from "../UserConfig";
import Modal from "../Modal";
import Button from "../Button";

const Select = ({ value, onChange, timeUnit }) => {
  let optionValues = [];
  if (timeUnit === "hours") {
    optionValues = [...Array(24).keys()];
  } else if (timeUnit === "minutes") {
    optionValues = [...Array(60).keys()].filter(n => n % 15 === 0);
  }

  return (
    <select
      onChange={onChange}
      value={value}
      css={css`
        font-size: 18px;
        padding: 4px;
      `}
    >
      {optionValues.map(v => (
        <option key={v} value={v}>
          {leftPad(v, 2, 0)}
        </option>
      ))}
    </select>
  );
};

export default function SettingsDetails({ isOpen, onToggle }) {
  const { userConfig, setUserConfig, userConfigRequest } = useContext(
    UserConfigContext
  );

  const { user, logout } = useUser();

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

  const handleDeleteAccount = () => {
    const choice = window.confirm(
      "Are you sure you want to delete the account"
    );

    if (choice) {
      onToggle();
      logout();
    }
  };

  const WordDaysInfo = ({ ...props }) => {
    return (
      <Card bg="primary.0" borderRadius={10} p={3} {...props}>
        <Text fontSize={1} fontWeight="bold">
          We consider Monday to Friday as working days
        </Text>
      </Card>
    );
  };

  const WorkTimeSettings = ({ ...props }) => (
    <Box {...props}>
      <Flex justifyContent="space-between" mb={2} alignItems="center">
        <Text fontWeight="bold" fontSize={2}>
          Work Day Begins At
        </Text>
        <Flex>
          <Box>
            <Select
              value={workingTime.workStartTime.hours}
              onChange={changeWorkStartTimeHours}
              timeUnit="hours"
            />
          </Box>
          <Text px={2}>:</Text>
          <Box>
            <Select
              value={workingTime.workStartTime.minutes}
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
            <Select
              value={workingTime.workEndTime.hours}
              onChange={changeWorkEndTimeHours}
              timeUnit="hours"
            />
          </Box>
          <Text px={2} alignSelf="center">
            :
          </Text>
          <Box>
            <Select
              value={workingTime.workEndTime.minutes}
              onChange={changeWorkEndTimeMinutes}
              timeUnit="minutes"
            />
          </Box>
        </Flex>
      </Flex>

      <Button
        type="primary"
        size="medium"
        alignSelf="flex-start"
        mt={2}
        onClick={handleSavingUserConfig}
      >
        Save
      </Button>
    </Box>
  );

  const AccountSettings = ({ ...props }) => {
    return (
      <Box {...props}>
        <Text fontWeight="bold" fontSize={2} mb={3}>
          Account Settings
        </Text>

        <Text fontSize={1}>You are currently logged in via</Text>
        <Text fontSize={2} fontWeight="bold" mt={2}>
          {user.email}
        </Text>

        <Button
          type="primary"
          size="medium"
          mt={3}
          onClick={handleDeleteAccount}
        >
          Delete Account
        </Button>
      </Box>
    );
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
        <WordDaysInfo mt={3} />
        <WorkTimeSettings mt={4} />
        <AccountSettings mt={4} mb={4} />
      </Flex>
    </Modal>
  );
}

SettingsDetails.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func
};
