import React, { useRef } from "react";
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
  appearance: none;
  height: 100%;
`;

// this component only works inside a <Formik />
export default function FormFieldSelect({
  name,
  label,
  placeholder = "Choose from list",
  options,
  ...props
}) {
  const areOptionsGrouped = options instanceof Map;

  let Options = [];

  if (areOptionsGrouped) {
    for (let [groupLabel, groupOptions] of options.entries()) {
      Options.push(
        <optgroup label={groupLabel} key={groupLabel}>
          {groupOptions.map(option => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </optgroup>
      );
    }
  } else {
    Options = options.map(option => (
      <option value={option} key={option}>
        {option}
      </option>
    ));
  }

  Options = [
    <option key="none" disabled value="none">
      {placeholder}
    </option>,
    ...Options
  ];

  const selectRef = useRef();

  return (
    <Field name={name} key={name}>
      {({ field, form: { errors, touched } }) => {
        return (
          <Flex flexDirection="column" {...props}>
            {label && (
              <Text as="label" htmlFor={field.name} mt={2} mb={2}>
                {label}
              </Text>
            )}
            <Flex alignItems="center">
              <Box
                css={css`
                  border-radius: 4px;
                  height: 4ex;
                `}
              >
                <select
                  {...field}
                  id={field.name}
                  ref={selectRef}
                  css={theme => css`
                  ${reset_browser_input_style}
                  background: ${theme.colors.neutrals[0]};
                  font-size: 14px;
                  padding: 0 10px;
                  border-radius: 4px;
                  transition: background-color 200ms;

                  &:not(:focus):hover {
                    background: ${theme.colors.neutrals[1]};
                  }
                `}
                >
                  {Options}
                </select>
                {touched[field.name] && errors[field.name] && (
                  <Text m={1} fontSize={1} color="red.2">
                    {errors[field.name]}
                  </Text>
                )}
              </Box>
            </Flex>
          </Flex>
        );
      }}
    </Field>
  );
}

FormFieldSelect.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ),
    PropTypes.instanceOf(Map)
  ]).isRequired,
  ...Box.propTypes
};
