import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import { Flex, Box, Text } from "@rebass/emotion";
import { useTrail, animated } from "react-spring";

import { useUser } from "../../hooks";
import Button from "../Button";
import FormField from "./FormField";
import FormFieldSelect from "./FormFieldSelect";
import { UserConfigContext } from "../UserConfig";
import { useErrorManager } from "../Errors";
import { USER_JOB_ROLES } from "../../constants";

const ANIMATION_CONFIG = {
  mass: 1.1,
  tension: 400
};

export default function GetUserDetailsForm({ onFormSubmit, ...props }) {
  const { user } = useUser();

  const assumedFirstName = user.displayName.split(" ")[0];
  const assumedLastName = user.displayName.split(" ")[1];

  // the first argument is the number of items
  // we will stagger
  const trail = useTrail(3, {
    from: { transform: "translateY(-50%)" },
    to: { transform: "translateY(0%)" },
    config: ANIMATION_CONFIG
  });

  return (
    <Box {...props}>
      <Formik
        initialValues={{
          firstName: assumedFirstName,
          lastName: assumedLastName,
          role: "none"
        }}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          onFormSubmit(values);
        }}
      >
        {() => {
          let FormRows = [
            <Flex mt={3}>
              <FormField name="firstName" label="First Name" mr={3} />
              <FormField name="lastName" label="Last Name" />
            </Flex>,
            <FormFieldSelect
              name="role"
              label="Role"
              options={USER_JOB_ROLES}
              mt={3}
            />,
            <Field>
              {({ form }) => (
                <Button
                  loading={form.isSubmitting}
                  type="primary"
                  formType="submit"
                  size="medium"
                  mt={4}
                >
                  Save
                </Button>
              )}
            </Field>
          ];

          return (
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
          );
        }}
      </Formik>
    </Box>
  );
}

GetUserDetailsForm.propTypes = {
  onFormSubmit: PropTypes.func.isRequired,
  ...Box.propTypes
};
