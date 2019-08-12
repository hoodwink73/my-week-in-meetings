import React from "react";
import { Box, Text, Heading, Link } from "@rebass/emotion";

export default function FAQ({ ...props }) {
  return (
    <Box {...props}>
      <Text fontSize={3} lineHeight={1.5}>
        <Heading as="h1" mt={6} mb={5} textAlign="center" fontSize={5}>
          Frequently Asked Questions
        </Heading>
        <Heading as="h2">How do you calculate deepwork time?</Heading>

        <Text as="p" lineHeight={1.5} mt={4}>
          We use a simple formula,
        </Text>

        <Text as="p" lineHeight={1.5}>
          <b>
            deepwork time = total time spent at work - (time spent in meetings +
            cool off time for every meeting)
          </b>
        </Text>
        <Text as="p">
          - <em>cool-off time</em> is <b>10 minutes</b> <em>before</em> and{" "}
          <em>after</em> the meeting
        </Text>
        <Text as="p">
          - you can change your <em>time spent at work</em> from the settings
        </Text>
        <Text as="p">
          - we do not consider meetings before and after the work day
        </Text>
        <Text as="p">
          - meetings overlapping each other are also taken into account
        </Text>
        <Heading as="h2" mt={5}>
          Why is my meeting not showing in the upcoming events?
        </Heading>
        <Text as="p" lineHeight={1.5} mt={4}>
          We filter <em>out</em> events which
        </Text>
        <Text> - have no other attendees except you</Text>
        <Heading as="h2" mt={5}>
          What permissions do you require on my calendar?
        </Heading>
        <Text as="p" lineHeight={1.5} mt={4}>
          We require a read and write access to your events. We require a write
          access because we allow you to <b>decline events</b>.
        </Text>
        <Heading as="h2" mt={5}>
          How do I delete my account?
        </Heading>
        <Text as="p" lineHeight={1.5} mt={4}>
          You can delete your account from the settings.
        </Text>
        <Text>
          Once you delete your account, we delete all your data and revoke any
          permissions provided by you to access your Google profile and
          calendar.
        </Text>
        <Heading as="h2" mt={5}>
          Why am I facing problem while signing up with my work account?
        </Heading>
        <Text mt={4}>
          Some organisations using G Suite explicitly block third-party apps.
        </Text>
        <Text as="p">
          Contact your G Suite admin and tell them whitelist us.
        </Text>
        <Text as="p">
          You can provide them{" "}
          <Link
            color="gray.4"
            href="https://developers.google.com/terms/api-services-user-data-policy"
          >
            this link
          </Link>{" "}
          to help them whitelist.
        </Text>
        <Text as="p">And also let them know</Text>
        <Text as="p">
          - we <b>do not</b> share your data with anybody
        </Text>
        <Text as="p">
          - we abide by{" "}
          <Link
            color="gray.4"
            href="https://developers.google.com/terms/api-services-user-data-policy"
          >
            Google User Data Policy.{" "}
          </Link>
        </Text>
      </Text>
    </Box>
  );
}

FAQ.propTypes = {
  ...Box.propTypes
};
