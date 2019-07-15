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
  height: 100%;
  background: url(data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0Ljk1IDEwIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9LmNscy0ye2ZpbGw6IzQ0NDt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPmFycm93czwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNC45NSIgaGVpZ2h0PSIxMCIvPjxwb2x5Z29uIGNsYXNzPSJjbHMtMiIgcG9pbnRzPSIxLjQxIDQuNjcgMi40OCAzLjE4IDMuNTQgNC42NyAxLjQxIDQuNjciLz48cG9seWdvbiBjbGFzcz0iY2xzLTIiIHBvaW50cz0iMy41NCA1LjMzIDIuNDggNi44MiAxLjQxIDUuMzMgMy41NCA1LjMzIi8+PC9zdmc+)
    no-repeat 98% 50%;
  -moz-appearance: none;
  -webkit-appearance: none;
  background-blend-mode: darken;
`;

// this component only works inside a <Formik />
export default function FormFieldSelect({
  name,
  label,
  placeholder = "Choose from list",
  options,
  projectValueFn,
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
              {typeof projectValueFn === "function"
                ? projectValueFn(option)
                : option}
            </option>
          ))}
        </optgroup>
      );
    }
  } else {
    Options = options.map(option => (
      <option value={option} key={option}>
        {typeof projectValueFn === "function" ? projectValueFn(option) : option}
      </option>
    ));
  }

  Options = [
    <option key="none" disabled hidden value="none">
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
            <Flex flexDirection="column" alignItems="start">
              <select
                {...field}
                id={field.name}
                ref={selectRef}
                css={theme => css`
                  ${reset_browser_input_style}
                  width: 100%;
                  height: 4ex;
                  background-color: ${theme.colors.neutrals[0]};
                  border-radius: 4px;
                  font-size: 14px;
                  padding: 0 10px;
                  border-radius: 4px;
                  transition: background-color 200ms;

                  &:not(:focus):hover {
                    background-color: ${theme.colors.neutrals[1]};

                    & > select {
                      background-color: ${theme.colors.neutrals[1]};
                    }
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
  projectValueFn: PropTypes.func,
  ...Box.propTypes
};
