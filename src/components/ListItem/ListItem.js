import React from "react";
import { Flex, Box, Card, Text, Button } from "@rebass/emotion";

export default function ListItem({ content }) {
  return (
    <Card bg="primary.1" borderRadius={50} p={[4]} mx={[3, 0]} mb={4}>
      <Text fontSize={[4, 5]} fontWeight="bold">
        {content}
      </Text>
    </Card>
  );
}
