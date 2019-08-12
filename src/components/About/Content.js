import React from "react";
import { Text, Link } from "@rebass/emotion";

export default function Content({ ...props }) {
  return (
    <Text {...props}>
      <p>
        Our last employer was a large corporate. The scale of collaboration and
        communication was a novel learning opportunity for us.
      </p>

      <p>
        But our collaboration were turning out to be more ad hoc than we have
        liked. And this had an impact on our team productivity.
      </p>

      <p>
        We felt that the reason for our ineffective communication could be
        attributed to the absence of basic principles in our work culture —
        agenda, action and attribution. And that resulted in meetings with too
        many participants, undefined agenda and outcomes.
      </p>

      <p>
        This inefficiency led to a vicious cycle of meetings. We confused
        meetings as work instead of participating in meetings to get work done.
      </p>

      <p>
        We tried to thrive in our personal work by practicing focused time. Many
        of our team members were using pomodoro technique to better estimate
        work and measure consistency.
      </p>

      <p>
        But superfluous meetings were always a bit overbearing and robbed
        individuals of their agency over their daily plans.
      </p>

      <p>
        After we quit our job, we had some time. We wanted to build a personal
        tool which will always remind an individual the balance between
        collaboration and productivity.
      </p>

      <p>
        This led us to build the deepwork clock. Deepwork clock is aware of your
        daily schedule. We have experienced that focus cannot be turned on and
        off like a switch, so we set aside some cool-off time for every meeting.
        After a few of these considerations, we constantly keep you updated on
        the time you have left—to get work done.
      </p>

      <p>
        We believe that this new found awareness will help you make better
        trade-offs between a spontaneous, maybe unnecessary event and a critical
        task at hand. And if you decide to decline a meeting, we help you with
        thoughtful decline responses.
      </p>

      <p>
        We want you to try out deepwork.today. Make thoughful interventations
        each day and restore the balance between collaboration and productivity.
      </p>

      <p>
        And we would be glad if you share your active efforts with us and help
        us make this app better. We look forward to it. Our Twitter DMs are
        opened.
      </p>

      <p>Best</p>
      <Link target="_blank" href="https://twitter.com/tanish2k">
        Saurabh
      </Link>
      <br />
      <br />

      <Link target="_blank" href="https://twitter.com/hwk73">
        Arijit
      </Link>

      <Text>
        <h2>Attributions</h2>

        <ul>
          <li>
            Homepage Illustration -{" "}
            <a href="https://absurd.design">Absurd Design</a>
          </li>
          <li>
            App Illustrations -{" "}
            <a href="https://stubborn.fun">Stubborn Generator</a>
          </li>
          <li>
            Icons - <a href="https://thenounproject.com">Noun Project</a>
          </li>
          <li>
            Decline Meetings and Tips Inspiration
            <ul>
              <li>
                <a href="https://hbr.org/2018/06/the-most-productive-meetings-have-fewer-than-8-people">
                  The Most Productive Meetings Have Fewer Than 8 People | HBR
                </a>
              </li>
              <li>
                <a href="https://hbr.org/2016/05/polite-ways-to-decline-a-meeting-invitation">
                  Polite Ways to Decline a Meeting Invitation| HBR
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </Text>
    </Text>
  );
}

Content.propTypes = {
  ...Text.propTypes
};
