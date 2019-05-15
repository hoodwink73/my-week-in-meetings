/** @jsx jsx */
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  useLayoutEffect
} from "react";
import PropTypes from "prop-types";
import { Flex, Box } from "@rebass/emotion";
import ReactModal from "react-modal";
import { css, jsx } from "@emotion/core";
import { ReactComponent as CloseIcon } from "../../icons/icon-close.svg";
import useMedia from "react-use/lib/useMedia";

ReactModal.setAppElement("#root");

const CUSTOM_STYLES = {
  small: {
    content: {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      padding: 0
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

export default function Modal({ children, contentFit, ...props }) {
  const isSmall = useMedia("(min-width: 40em)");
  const isMedium = useMedia("(min-width: 52em)");
  const isLarge = useMedia("(min-width: 64em)");

  const [modalDimesions, setModalDimensions] = useState(null);

  const measuredRef = useCallback(
    node => {
      if (node !== null) {
        setModalDimensions(node.getBoundingClientRect());
      }
    },
    [children]
  );

  let customStyles;

  if (contentFit) {
    // this is a fix to get the correct width of the
    // modal content for the first time
    let styles = { right: "auto" };
    if (modalDimesions) {
      const { width, height } = modalDimesions;
      styles = {
        height,
        top: `calc(50% - ${height / 2}px)`,
        left: `calc(50% - ${width / 2}px)`,
        bottom: "auto",
        right: "auto",
        padding: 0
      };
    }

    customStyles = {
      content: {
        ...styles
      }
    };
  } else if (isLarge) {
    customStyles = CUSTOM_STYLES.large;
  } else {
    customStyles = CUSTOM_STYLES.small;
  }

  return (
    <ReactModal {...props} style={customStyles}>
      <Flex
        width="auto"
        ref={measuredRef}
        flexDirection="column"
        css={() =>
          contentFit
            ? ""
            : css`
                height: 100%;
              `
        }
      >
        <Box alignSelf="flex-end">
          <CloseIcon
            width="32"
            onClick={props.onRequestClose}
            style={{ cursor: "pointer" }}
          />
        </Box>
        <Box
          css={() =>
            contentFit
              ? ""
              : css`
                  height: 100%;
                `
          }
        >
          {children}
        </Box>
      </Flex>
    </ReactModal>
  );
}

Modal.propTypes = {
  contentFit: PropTypes.bool,
  ...ReactModal.propTypes
};

Modal.defaultProps = {
  contentFit: false
};
