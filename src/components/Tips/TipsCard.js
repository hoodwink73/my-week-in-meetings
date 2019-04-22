import React from "react";
import PropTypes from "prop-types";
import { Card, Text } from "@rebass/emotion";

export default function TipsCard({ title, onToggle }) {
  return (
    <Card
      width={[1, 400]}
      bg="gray.0"
      borderRadius={8}
      p={3}
      boxShadow="0 2px 2px rgba(0, 0, 0, 0.25)"
      style={{ cursor: "pointer" }}
      onClick={onToggle}
    >
      <Text fontSize={2} fontFamily="sans" textAlign="center" color="gray.4">
        {title}
      </Text>
    </Card>
  );
}

TipsCard.propTypes = {
  title: PropTypes.string.isRequired,
  onToggle: PropTypes.func
};
