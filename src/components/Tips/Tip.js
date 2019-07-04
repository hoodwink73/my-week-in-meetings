import React, { useState, useReducer } from "react";
import PropTypes from "prop-types";
import { Flex, Box, Text, Button, Image, Card, Link } from "@rebass/emotion";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import Modal from "../Modal";
import Pagination from "../Pagination";
import useMedia from "react-use/lib/useMedia";

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

  const isLarge = useMedia("(min-width: 64em)");

  let isIntroStep = CurrentStep === steps.get("intro");
  let isLastStep = CurrentStep === steps.get("finish");

  const handleModalOpen = () => {
    setModalOpen(true);
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

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose} contentFit>
        <Box width={["calc(90vw)", 600]}>
          <>
            <Flex width={1} bg="primary.0" justifyContent="center">
              <Graphic
                css={css`
                  width: auto;
                  margin: auto;
                  height: ${isLarge ? "278px" : "20vh"};
                `}
              />
            </Flex>
            <Box width={9 / 10} mx="auto">
              <Text fontSize={2} fontWeight="bold" mx="auto" my={2}>
                {title}
              </Text>

              <Box
                mt={4}
                mb={3}
                css={css`
                  height: 4em;
                `}
              >
                <CurrentStep />
              </Box>

              <Flex width={1} justifyContent="space-between" mb={3}>
                {!isIntroStep && (
                  <Pagination
                    width={12}
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
                      No, Thanks
                    </Button>
                  )}

                  {!isLastStep && (
                    <Button type="primary" size="medium" onClick={handleYes}>
                      {isIntroStep ? "Start The Guide" : "Next"}
                    </Button>
                  )}

                  {isLastStep && (
                    <Button
                      type="primary"
                      size="medium"
                      onClick={handleModalClose}
                    >
                      Finish
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
