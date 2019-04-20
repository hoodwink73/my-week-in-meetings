import React from "react";
import PropTypes from "prop-types";
import { Tabs, TabList, Tab } from "@reach/tabs";
import { Flex, Box, Text } from "@rebass/emotion";

function TabWithStyle(props) {
  // `isSelected` comes from `TabList` cloning the `CoolTab`.
  const { isSelected, children } = props;

  // make sure to forward *all* props received from TabList
  return (
    <Tab
      {...props}
      style={{
        ...(isSelected ? { textDecoration: "underline" } : {}),
        ...{ cursor: "pointer" }
      }}
    >
      {children}
    </Tab>
  );
}

export default function SelectTimeTange({
  handleTimeRangeToggle,
  children,
  ...props
}) {
  return (
    <Box {...props}>
      <Tabs onChange={handleTimeRangeToggle} defaultIndex={0}>
        <TabList as={Flex}>
          <TabWithStyle as={Text} fontSize={1} fontWeight={2}>
            Today
          </TabWithStyle>
          <TabWithStyle as={Text} ml={2} fontSize={1} fontWeight={2}>
            This Week
          </TabWithStyle>
        </TabList>

        {children}
      </Tabs>
    </Box>
  );
}

SelectTimeTange.propTypes = {
  handleTimeRangeToggle: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  ...Box.propTypes
};
