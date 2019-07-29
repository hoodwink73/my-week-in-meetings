import React, { useRef, useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import Alert from "@reach/alert";
import { Flex, Box, Card, Text } from "@rebass/emotion";
import { useTransition, animated, config } from "react-spring";

import {
  ErrorManagerContext,
  ErrorDispatcherContext
} from "./ErrorManagerContext";
import { ReactComponent as CloseIcon } from "../../icons/icon-close.svg";

export default function Errors() {
  const portalParentRef = useRef(null);
  const { errorsState } = useContext(ErrorManagerContext);
  const { dispatch } = useContext(ErrorDispatcherContext);

  useEffect(() => {
    portalParentRef.current = document.getElementById("errors-container");

    return () => {
      portalParentRef.current.remove();
      portalParentRef.current = null;
    };
  }, []);

  const transitions = useTransition(errorsState, error => error.id, {
    from: { transform: "translate3d(0,100%,0)", opacity: 0 },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: { opacity: 0 }
  });

  return (
    <>
      {portalParentRef.current
        ? createPortal(
            <>
              {transitions.map(({ item, props, key }) => (
                <animated.div key={key} style={props}>
                  <Card
                    as={animated.div}
                    bg="red.0"
                    mb={3}
                    borderRadius={4}
                    p={3}
                    boxShadow="small"
                  >
                    <Alert>
                      <Flex>
                        <Text
                          color="red.2"
                          fontSize={1}
                          fontWeight="bold"
                          flex="1 1 auto"
                        >
                          {item.message}
                        </Text>
                        {item.canDismiss && (
                          <Box
                            alignSelf="flex-end"
                            flex="1 0 auto"
                            onClick={() =>
                              dispatch({
                                type: "DISMISS",
                                id: item.id
                              })
                            }
                          >
                            <CloseIcon
                              width="20"
                              style={{ cursor: "pointer" }}
                            />
                          </Box>
                        )}
                      </Flex>
                    </Alert>
                  </Card>
                </animated.div>
              ))}
            </>,
            portalParentRef.current
          )
        : null}
    </>
  );
}
