import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Text, Flex, Box, Card, Image } from "@rebass/emotion";
import useMedia from "react-use/lib/useMedia";

import InviteListTipImage from "../../images/invite-list-tip.svg";
import ActiveParticipationTipImage from "../../images/active-participation-tip.svg";

import Tip from "./Tip";

import InviteListIntro from "./InviteList/InviteListIntro";
import MostKnowledge from "./InviteList/MostKnowledge";
import Implementation from "./InviteList/Implementation";
import Impacted from "./InviteList/Impacted";
import Participation from "./InviteList/Participation";

import ActiveParticipationIntro from "./ActiveParticipation/ActiveParticipationIntro";
import Perspective from "./ActiveParticipation/Perspective";
import Listening from "./ActiveParticipation/Listening";
import Speaking from "./ActiveParticipation/Speaking";
import SelfAware from "./ActiveParticipation/SelfAware";

const InviteListGraphic = ({ ...props }) => (
  <Image width={1} src={InviteListTipImage} {...props} />
);

const ActiveParticipation = ({ ...props }) => (
  <Image width={1} src={ActiveParticipationTipImage} {...props} />
);

const TIPS_CONTENT = new Map([
  [
    "InviteList",
    {
      graphic: InviteListGraphic,
      title: "How to be mindful about your invite list",
      steps: new Map([
        ["intro", InviteListIntro],
        ["finish", Participation],
        [InviteListIntro, MostKnowledge],
        [MostKnowledge, Implementation],
        [Implementation, Impacted],
        [Impacted, Participation]
      ])
    }
  ],
  [
    "ActiveParticpation",
    {
      graphic: ActiveParticipation,
      title: "How to make most out of your meetings",
      steps: new Map([
        ["intro", ActiveParticipationIntro],
        ["finish", SelfAware],
        [ActiveParticipationIntro, Perspective],
        [Perspective, Listening],
        [Listening, Speaking],
        [Speaking, SelfAware]
      ])
    }
  ]
]);

let children = [];

for (let tipDetails of TIPS_CONTENT.values()) {
  children.push(
    <Tip
      key={tipDetails.title}
      title={tipDetails.title}
      graphic={tipDetails.graphic}
      steps={tipDetails.steps}
    />
  );
}

export default function Tips() {
  const isLarge = useMedia("(min-width: 64em)");

  return (
    <Flex
      mt={2}
      mb={4}
      width={1}
      css={css`
        overflow-x: scroll;
        & > div {
          flex-shrink: ${isLarge ? 1 : 0};
        }
      `}
    >
      {children}
    </Flex>
  );
}
