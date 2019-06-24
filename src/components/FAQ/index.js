import React from "react";
import { Box, Text, Heading } from "@rebass/emotion";

export default function FAQ() {
  return (
    <Box>
      <Heading as="h1" mt={6} mb={5} textAlign="center" fontSize={5}>
        Frequently Asked Questions
      </Heading>

      <Heading as="h2">How to setup Deepwork Today?</Heading>

      <Text as="p" lineHeight={1.5}>
        Just sign up with your Google Account for work. Permit us to manage your
        events on your calendar.
      </Text>

      <Heading as="h2" mt={4}>
        What data is synced while I sign up with Google?
      </Heading>

      <Text as="p" lineHeight={1.5}>
        We get your basic profile information and we regularly sync events from
        your primary calendar .
      </Text>

      <Heading as="h2" mt={4}>
        How do we use your calendar events?
      </Heading>

      <Text as="p" lineHeight={1.5}>
        We use duration of <em>events</em> to show you a timer which tells you
        how time is left for work today.
      </Text>

      <Text as="p" lineHeight={1.5}>
        We use partial events deatils to show you upcoming events for today.
      </Text>

      <Text as="p" lineHeight={1.5}>
        We also help you to decline events. You can take a quick quiz to decide
        whether you are ready for the meeting. Depending on the circumstance we
        provide you a template response with which you can decline the meeting.
      </Text>

      <Text as="p" lineHeight={1.5}>
        We use past event details to provide you relevant analytics.
      </Text>

      <Heading as="h2" mt={4}>
        How to delete my account?
      </Heading>

      <Text as="p" lineHeight={1.5}>
        You can delete your account from <em>Settings</em>?
      </Text>

      <Text as="p" lineHeight={1.5}>
        When you delete an account,{" "}
      </Text>

      <Text as="p" lineHeight={1.5}>
        - we delete all calendar data and related analytics,{" "}
      </Text>

      <Text as="p" lineHeight={1.5}>
        - revoke access to the token we obtain from Google to fetch calendar
        events{" "}
      </Text>

      <Text as="p" lineHeight={1.5}>
        - cancel calendar push notification to ensure we are not notified of
        your future events
      </Text>

      <Heading as="h2" mt={4}>
        How do we secure you data?
      </Heading>

      <Text as="p" lineHeight={1.5}>
        Your calendar events and related analytics cannot be accessed by anybody
        but you.
      </Text>

      <Text as="p" lineHeight={1.5}>
        We <strong>do not</strong> share your data with anybody.
      </Text>
    </Box>
  );
}
