/** @jsx jsx */
import React from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "@rebass/emotion";
import ReactModal from "react-modal";
import { css, jsx } from "@emotion/core";
import { ReactComponent as NavigationBackIcon } from "../../icons/icon-cheveron-left-circle.svg";
import useMedia from "react-use/lib/useMedia";

ReactModal.setAppElement("#root");

const CUSTOM_STYLES = {
  small: {
    content: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }
  },
  medium: {
    content: {
      top: "5vh",
      left: "5vh",
      right: "5vh",
      bottom: "5vh"
    }
  },
  large: {
    content: {
      top: "10vh",
      left: "10vh",
      right: "10vh",
      bottom: "10vh"
    }
  }
};

export default function Modal({ children, ...props }) {
  const isSmall = useMedia("(min-width: 40em)");
  const isMedium = useMedia("(min-width: 52em)");
  const isLarge = useMedia("(min-width: 64em)");

  let customStyles;

  if (isLarge) {
    customStyles = CUSTOM_STYLES.large;
  } else if (isMedium) {
    customStyles = CUSTOM_STYLES.medium;
  } else {
    customStyles = CUSTOM_STYLES.small;
  }

  return (
    <ReactModal {...props} style={customStyles}>
      <Flex
        flexDirection="column"
        css={css`
          height: 100%;
        `}
      >
        <Box>
          <NavigationBackIcon
            width="32"
            onClick={props.onRequestClose}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Box mt={2} width={1} flex="1 0 auto">
          {children}
        </Box>
      </Flex>
    </ReactModal>
  );
}

Modal.propTypes = {
  ...ReactModal.propTypes
};
