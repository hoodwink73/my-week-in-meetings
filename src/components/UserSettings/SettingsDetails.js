import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Card } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import useMedia from "react-use/lib/useMedia";
import leftPad from "left-pad";
import firebase from "@firebase/app";
import "@firebase/functions";

import { useUser } from "../../hooks";
import { track } from "../../utils";
import { UserConfigContext } from "../UserConfig";
import Modal from "../Modal";
import Button from "../Button";

import ChooseWorkOffDays from "./ChooseWorkOffDays";

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
  const [isDeletingAccount, setDeleteAccount] = useState(false);

  useEffect(() => {
    setWorkingTime(userConfig);
  }, [userConfig]);

  const isLarge = useMedia("(min-width: 64em)");

  const requestDeleteUserCloudFn = firebase
    .functions()
    .httpsCallable("onDeleteUserRequest");

  if (userConfigRequest.error) {
    console.error(userConfigRequest.error);
    return "Error loading config";
  }

  const changeWorkStartTimeHours = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workStartTime: {
        ...workingTime.workStartTime,
        hours: parseInt(value, 10)
      }
    });

  const changeWorkStartTimeMinutes = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workStartTime: {
        ...workingTime.workStartTime,
        minutes: parseInt(value, 10)
      }
    });

  const changeWorkEndTimeHours = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workEndTime: { ...workingTime.workEndTime, hours: parseInt(value, 10) }
    });

  const changeWorkEndTimeMinutes = ({ target: { value } }) =>
    setWorkingTime({
      ...workingTime,
      workEndTime: { ...workingTime.workEndTime, minutes: parseInt(value, 10) }
    });

  const handleOffDaysChange = event => {
    let { value, checked } = event.target;

    value = parseInt(value, 10);

    setWorkingTime(prevWorkingTime => {
      var prevWorkingDays = prevWorkingTime.workingDays;
      let workingDays;
      if (checked) {
        workingDays = prevWorkingDays.filter(day => day !== value);
      } else {
        workingDays = [...prevWorkingDays, value];
      }

      return {
        ...prevWorkingTime,
        workingDays: workingDays.sort()
      };
    });
  };

  const handleSavingUserConfig = () => {
    setUserConfig({ workingTime });
    onToggle();
  };

  const handleDeleteAccount = () => {
    const choice = window.confirm(`
      Are you sure you want to delete the account?
      We delete all your data once you delete the account.
      It cannot be recovered.
    `);

    if (choice) {
      setDeleteAccount(true);
      requestDeleteUserCloudFn().then(() => {
        try {
          const auth2 = window.gapi.auth2.getAuthInstance();
          // Revokes all of the scopes that the user granted
          auth2.disconnect();
        } catch (e) {
          console.error("Could not revoke access", e);
        }

        track({
          mixpanel: {
            eventName: "delete account"
          }
        });

        track.updateUserProfileInMixpanel({
          deleted: true
        });

        logout();
        onToggle();
      });
    }
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

      <ChooseWorkOffDays
        mt={4}
        mb={2}
        daysOfWork={workingTime.workingDays}
        onChange={handleOffDaysChange}
      />

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
          loading={isDeletingAccount}
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
