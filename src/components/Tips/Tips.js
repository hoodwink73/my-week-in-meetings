import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Text, Flex, Box, Card, Image } from "@rebass/emotion";
import useMedia from "react-use/lib/useMedia";

import InviteListTipImage from "../../images/tips-invite-list.png";
import ActiveParticipationTipImage from "../../images/tips-participate-better.png";

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
      ]),
      source: new Map([
        [
          "url",
          "https://hbr.org/2018/06/the-most-productive-meetings-have-fewer-than-8-people"
        ],
        ["title", "HBR"]
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
      ]),
      source: new Map([
        [
          "url",
          "https://hbr.org/2018/06/the-most-productive-meetings-have-fewer-than-8-people"
        ],
        ["title", "HBR"]
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
      source={tipDetails.source}
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
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        & > div {
          flex-shrink: ${isLarge ? 1 : 0};
        }
      `}
    >
      {children}
    </Flex>
  );
}
