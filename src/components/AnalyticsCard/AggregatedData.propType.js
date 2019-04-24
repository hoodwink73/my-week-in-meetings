import PropTypes from "prop-types";

export default PropTypes.shape({
  aggregateAverageMeetingTime: PropTypes.number.isRequired,
  aggregateTotalMeetingTime: PropTypes.number.isRequired,
  eventCreatorByDomainsFrequency: PropTypes.objectOf(PropTypes.number),
  eventsFrequencyByDayOfWeek: PropTypes.objectOf(PropTypes.number),
  gapBetweenMeetings: PropTypes.arrayOf(
    PropTypes.exact({
      event: PropTypes.string.isRequired,
      nextEvent: PropTypes.string.isRequired,
      timeGapBetweenEventsInMs: PropTypes.number.isRequired
    })
  ),
  rankCollaborators: PropTypes.objectOf(PropTypes.number),
  selfOrganisedVsInvited: PropTypes.objectOf(PropTypes.number)
});
