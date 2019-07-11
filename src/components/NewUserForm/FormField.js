import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";
import { Flex, Box, Text } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";

const reset_browser_input_style = css`
  border: 0;
  padding: 0;
  margin: 0;
  outline: 0;
  height: 100%;
`;

// Can only be used within a <Formik /> form
export default function FormField({ name, label, placeholder = "", ...props }) {
  return (
    <Field name={name} key={name} label={label} placeholder={placeholder}>
      {({ field }) => {
        return (
          <Flex flexDirection="column" mt={3} {...props}>
            {label && (
              <Text as="label" htmlFor={field.name} mt={2} mb={2}>
                {label}
              </Text>
            )}
            <Box
              css={css`
                border-radius: 4px;
                line-height: 2;
              `}
            >
              <input
                {...field}
                id={name}
                placeholder={placeholder}
                css={theme => css`
                  ${reset_browser_input_style}
                  background: ${theme.colors.neutrals[0]};
                  font-size: 14px;
                  padding: 0 10px;
                  border-radius: 4px;
                  height: 4ex;

                  &:not(:focus):hover {
                    background: ${theme.colors.neutrals[1]};
                  }

                  &:active, &:focus {
                    border: 1px solid ${theme.colors.neutrals[6]}
                  }
                `}
              />
            </Box>
          </Flex>
        );
      }}
    </Field>
  );
}

FormField.propTypes = {
  label: PropTypes.string,
  ...Box.propTypes
};
