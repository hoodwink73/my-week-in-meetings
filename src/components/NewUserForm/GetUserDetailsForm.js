import React, { useContext } from "react";
import PropTypes from "prop-types";
import { Formik, Form, Field } from "formik";
import { Flex, Box, Text } from "@rebass/emotion";
import { useTrail, animated } from "react-spring";

import { useUser } from "../../hooks";
import Button from "../Button";
import FormField from "./FormField";
import FormFieldSelect from "./FormFieldSelect";

import { USER_JOB_ROLES } from "../../constants";

const ANIMATION_CONFIG = {
  mass: 0.5,
  tension: 200
};

export default function GetUserDetailsForm({ onFormSubmit, ...props }) {
  const { user } = useUser();

  const assumedFirstName = user.displayName.split(" ")[0];
  const assumedLastName = user.displayName.split(" ")[1];

  // the first argument is the number of items
  // we will stagger
  const trail = useTrail(3, {
    from: { transform: "translateY(-100%)" },
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
        validate={values => {
          let errors = {};
          if (values.role === "none") {
            errors.role = "Please let us know about your role";
          }

          return errors;
        }}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          onFormSubmit(values);
        }}
      >
        {() => {
          let FormRows = [
            <Flex flexDirection={["column", "row"]} mt={3}>
              <FormField
                name="firstName"
                label="First Name"
                mr={[0, 3]}
                mb={[3, 0]}
              />
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
                  disabled={Object.keys(form.errors).length > 0}
                  loading={form.isSubmitting}
                  type="primary"
                  formType="submit"
                  size="medium"
                  mt={5}
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
