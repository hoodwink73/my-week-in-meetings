import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import { Flex, Box, Text } from "@rebass/emotion";
import { useTrail, animated } from "react-spring";
import leftPad from "left-pad";

import Button from "../Button";
import FormFieldSelect from "./FormFieldSelect";
import { UserConfigContext } from "../UserConfig";

const OPTIONS_FOR_CHOOSING_HOUR = [...Array(24).keys()];
const OPTIONS_FOR_CHOOSING_MINUTES = [...Array(60).keys()].filter(
  n => n % 15 === 0
);

const ANIMATION_CONFIG = {
  mass: 0.5,
  tension: 200
};

export default function GetDailySchedule({ onFormSubmit, ...props }) {
  const { userConfig } = useContext(UserConfigContext);

  const trail = useTrail(3, {
    from: { transform: "translateY(100%)" },
    to: { transform: "translateY(0%)" },
    config: ANIMATION_CONFIG
  });

  const FormRows = [
    <Box mt={3}>
      <Text fontWeight="bold" mb={3}>
        What time do you start your work?
      </Text>
      <Flex>
        <FormFieldSelect
          name="workStartTime.hours"
          options={OPTIONS_FOR_CHOOSING_HOUR}
          projectValueFn={value => leftPad(value, 2, 0)}
          mr={3}
        />
        <FormFieldSelect
          name="workStartTime.minutes"
          options={OPTIONS_FOR_CHOOSING_MINUTES}
          projectValueFn={value => leftPad(value, 2, 0)}
        />
      </Flex>
    </Box>,

    <Box mt={3}>
      <Text fontWeight="bold" mb={3}>
        What time do you end your work?
      </Text>
      <Flex>
        <FormFieldSelect
          name="workEndTime.hours"
          options={OPTIONS_FOR_CHOOSING_HOUR}
          projectValueFn={value => leftPad(value, 2, 0)}
          mr={3}
        />
        <FormFieldSelect
          name="workEndTime.minutes"
          options={OPTIONS_FOR_CHOOSING_MINUTES}
          projectValueFn={value => leftPad(value, 2, 0)}
        />
      </Flex>
    </Box>,
    <Field>
      {({ form }) => (
        <Button
          loading={form.isSubmitting}
          type="primary"
          formType="submit"
          size="medium"
          mt={5}
        >
          Let's Get Started
        </Button>
      )}
    </Field>
  ];

  return (
    <Box {...props}>
      <Formik
        initialValues={{
          workStartTime: userConfig.workStartTime,
          workEndTime: userConfig.workEndTime
        }}
        onSubmit={(values, action) => {
          onFormSubmit(values).then(() => action.setSubmitting(false));
        }}
      >
        <Form>
          {trail.map((props, index) => {
            let FormRow = FormRows[index];
            return (
              <animated.div style={props} key={index}>
                {FormRow}
              </animated.div>
            );
          })}
        </Form>
      </Formik>
    </Box>
  );
}

GetDailySchedule.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  ...Box.propTypes
};
