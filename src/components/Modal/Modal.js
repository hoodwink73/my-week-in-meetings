import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "@rebass/emotion";
import ReactModal from "react-modal";

import { ReactComponent as NavigationBackIcon } from "../../icons/icon-cheveron-left-circle.svg";

ReactModal.setAppElement("#root");

const customStyles = {
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
};

export default function Modal({ children, ...props }) {
  return (
    <ReactModal {...props} style={customStyles}>
      <Flex flexDirection="column">
        <Box>
          <NavigationBackIcon
            width="32"
            onClick={props.onRequestClose}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Box alignSelf="center">{children}</Box>
      </Flex>
    </ReactModal>
  );
}

Modal.propTypes = {
  ...ReactModal.propTypes
};
