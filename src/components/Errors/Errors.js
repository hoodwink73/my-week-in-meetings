import React, { useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import Alert from "@reach/alert";
import { Flex, Box, Card, Text } from "@rebass/emotion";

import { ErrorManagerContext } from "./ErrorManagerContext";
import { ReactComponent as CloseIcon } from "../../icons/icon-close.svg";

export default function Errors() {
  const portalParentRef = useRef(null);
  const { errorsState, dispatch } = useContext(ErrorManagerContext);

  useEffect(() => {
    portalParentRef.current = document.getElementById("errors-container");

    return () => {
      portalParentRef.current.remove();
      portalParentRef.current = null;
    };
  }, []);

  if (portalParentRef.current) {
    return createPortal(
      <>
        {errorsState.map(error => (
          <Card
            bg="red.0"
            key={error.id}
            mb={3}
            borderRadius={4}
            p={2}
            boxShadow="small"
          >
            <Alert>
              <Flex>
                <Text
                  color="red.2"
                  fontSize={1}
                  fontWeight="bold"
                  flex="1 0 auto"
                >
                  {error.message}
                </Text>
                {error.canDismiss && (
                  <Box
                    alignSelf="flex-end"
                    onClick={() => dispatch({ type: "DISMISS", id: error.id })}
                  >
                    <CloseIcon width="20" style={{ cursor: "pointer" }} />
                  </Box>
                )}
              </Flex>
            </Alert>
          </Card>
        ))}
      </>,
      portalParentRef.current
    );
  } else {
    return null;
  }
}
