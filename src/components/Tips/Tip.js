import React, { useState, useReducer, useEffect } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Image, Card } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Modal from "../Modal";
import Pagination from "../Pagination";
import Button from "../Button";
import useMedia from "react-use/lib/useMedia";
import { useTransition, animated } from "react-spring";

const ANIMATION_CONFIG = {
  mass: 1.1,
  tension: 100,
  friction: 50
};

export default function Tip({ title, steps, graphic: Graphic }) {
  const reducer = (state, action) => {
    switch (action.type) {
      case "reset":
        return steps.get("intro");
      case "next":
        return steps.get(state);
      default:
        return state;
    }
  };

  const [CurrentStep, dispatch] = useReducer(reducer, steps.get("intro"));
  const [isModalOpen, setModalOpen] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  const [animateGraphic, setAnimateGraphic] = useState(false);
  const [animateCurrentStep, setAnimateCurrentStep] = useState(false);

  const isLarge = useMedia("(min-width: 64em)");

  useEffect(() => {
    setAnimateGraphic(isModalOpen);
  }, [isModalOpen]);

  useEffect(() => {
    setAnimateCurrentStep(CurrentStep.name);
  }, [CurrentStep.name]);

  let isIntroStep = CurrentStep === steps.get("intro");
  let isLastStep = CurrentStep === steps.get("finish");

  const slideUpTransitions = useTransition(animateCurrentStep, null, {
    from: { transform: "translateY(200%)", opacity: 1 },
    enter: { transform: "translateY(0%)" },
    leave: { transform: "translateY(100%)", opacity: 0 },
    config: { mass: 1, tension: 350, friction: 20 }
  });

  const opacityTransitions = useTransition(animateGraphic, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: ANIMATION_CONFIG
  });

  var transitions = opacityTransitions;

  const handleModalOpen = () => {
    setModalOpen(true);

    // track how many times a user is clicking on tip
    if (window.ga) {
      console.log("sending event to ga", title);
      window.ga("send", {
        hitType: "event",
        eventCategory: "tips",
        eventAction: "view",
        eventLabel: title
      });
    }
  };

  const handleModalClose = () => {
    setStepCount(0);
    dispatch({
      type: "reset"
    });
    setModalOpen(false);
  };

  const handleYes = () => {
    setStepCount(c => c + 1);
    dispatch({
      type: "next"
    });
  };

  const getComponentByName = componentName => {
    for (let [currentStep, nextStep] of steps.entries()) {
      if (currentStep.name === componentName) {
        return currentStep;
      } else if (nextStep.name === componentName) {
        return nextStep;
      }
    }
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose} contentFit>
        <Box width={["calc(90vw)", 600]}>
          <>
            <Box
              width={1}
              css={css`
                position: relative;
                height: ${isLarge ? "278px" : "20vh"};
              `}
            >
              {transitions.map(
                ({ item, key, props }) =>
                  item && (
                    <animated.div
                      key={key}
                      style={props}
                      css={css`
                        position: absolute;
                        left: 0;
                        right: 0;
                        top: 0;
                      `}
                    >
                      <Flex width={1} bg="primary.0" justifyContent="center">
                        <Graphic
                          css={css`
                            width: auto;
                            margin: auto;
                            height: ${isLarge ? "278px" : "20vh"};
                          `}
                        />
                      </Flex>
                    </animated.div>
                  )
              )}
            </Box>
            <Box width={8 / 10} mx="auto">
              <Text fontSize={2} fontWeight="bold" mx="auto" my={4}>
                {title}
              </Text>

              <Box
                mt={4}
                mb={3}
                fontSize={3}
                css={css`
                  position: relative;
                  height: 4em;
                `}
              >
                {slideUpTransitions.map(({ item, key, props }) => {
                  var Component = item && getComponentByName(item);
                  return (
                    Component && (
                      <animated.div
                        key={key}
                        style={props}
                        css={css`
                          position: absolute;
                        `}
                      >
                        <Component />
                      </animated.div>
                    )
                  );
                })}
              </Box>

              <Flex width={1} justifyContent="space-between" mb={3}>
                {!isIntroStep && (
                  <Pagination
                    width={8}
                    count={steps.size - 1}
                    current={stepCount}
                    alignSelf="center"
                  />
                )}

                <Flex
                  justifyContent="flex-end"
                  css={css`
                    flex-grow: 1;
                  `}
                >
                  {isIntroStep && (
                    <Button
                      mr={2}
                      size="medium"
                      variant="text"
                      onClick={handleModalClose}
                    >
                      <Text width={1} fontSize={1}>
                        No, Thanks
                      </Text>
                    </Button>
                  )}

                  {!isLastStep && (
                    <Button
                      width={[0.5, 0.3]}
                      type="primary"
                      size="medium"
                      onClick={handleYes}
                    >
                      <Text width={1} fontSize={1}>
                        {isIntroStep ? "Start The Guide" : "Next"}
                      </Text>
                    </Button>
                  )}

                  {isLastStep && (
                    <Button
                      width={[0.5, 0.3]}
                      type="primary"
                      size="medium"
                      onClick={handleModalClose}
                    >
                      <Text width={1} fontSize={1}>
                        Finish
                      </Text>
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Box>
          </>
        </Box>
      </Modal>
      <Card
        as={Flex}
        flexWrap="wrap"
        bg="white.1"
        width={[1 / 2]}
        p={3}
        fontSize={[2, 3]}
        borderRadius={8}
        css={css`
          cursor: pointer;
        `}
        mr={2}
        onClick={handleModalOpen}
      >
        <Graphic
          width={3 / 4}
          alignSelf="center"
          mx="auto"
          css={css`
            display: block;
            ${"" /*  hack for Safari to set the height of the image*/}
            ${"" /*  otherwise the tips appear elongated*/}
            height: intrinsic;
          `}
        />
        <Text
          width={1}
          mt={3}
          fontWeight="bold"
          textAlign="center"
          alignSelf="flex-end"
        >
          {title}
        </Text>
      </Card>
    </>
  );
}

Tip.propTypes = {
  title: PropTypes.string.isRequired,
  steps: PropTypes.object.isRequired,
  graphic: PropTypes.func.isRequired
};
