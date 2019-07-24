import moment from "moment";

export const DAYS_OF_WEEKS = [...Array(7).keys()].map(index =>
  moment()
    .isoWeekday(index)
    .format("dddd")
);

export const DEFAULT_WORKING_TIME = {
  workStartTime: { hours: 9, minutes: 0 },
  workEndTime: { hours: 17, minutes: 0 },
  workingDays: [1, 2, 3, 4, 5]
};

export const CALENDAR_EVENTS_PERMISSION_SCOPE =
  "https://www.googleapis.com/auth/calendar.events";

export const EVENT_STATUSES = new Map([
  ["Accepted", "accepted"],
  ["Maybe", "tentative"],
  ["Declined", "declined"],
  ["Not Responded", "needsAction"]
]);

export const DAY_STATUSES = new Map([
  ["YET_TO_BEGIN", 1],
  ["IN_PROGRESS", 2],
  ["ENDED", 3],
  ["NO_WORK_TODAY", 4]
]);

export const ERRORS = new Map([
  [
    "USER_SCOPE_INADEQUATE",
    "You haven't signed up with the selected Google account. Sign up before you log in"
  ],
  [
    "GOOGLE_AUTH_INSTANCE_NOT_READY",
    "The Google Sign-In is experiencing a problem."
  ],
  [
    "USER_DENIED_PERMISSION",
    "You did not provide us adequate permission to create an account"
  ],
  [
    "USER_SUSPENDED_GOOGLE_SIGN_IN_POPUP",
    "Signing into your google account was interrupted"
  ]
]);

export const GOOGLE_SIGN_IN_ERRORS = ["popup_closed_by_user", "access_denied"];

export const USER_JOB_ROLES = new Map([
  [
    "Software Engineer",
    [
      "Mobile Developer",
      "Frontend Developer",
      "Backend Developer",
      "Full-Stack Developer",
      "Engineering Manager",
      "QA Engineer",
      "DevOps",
      "Software Architect",
      "Designer",
      "UI/UX Designer",
      "User Researcher",
      "Visual Designer",
      "Creative Director"
    ]
  ],
  [
    "Engineering",
    ["Hardware Engineer", "Mechanical Engineer", "Systems Engineer"]
  ],
  ["Product", ["Data Scientist", "Product Manager", "Project Manager"]],
  ["Bussiness", ["Attorney", "Business Analyst"]],
  [
    "Operations",
    [
      "Finance/Accounting",
      "H.R.",
      "Office Manager",
      "Recruiter",
      "Customer Service",
      "Operations Manager"
    ]
  ],
  [
    "Sales",
    [
      "Business Development",
      "Sales Development",
      "Account Executive",
      "BD Manager",
      "Account Manager",
      "Sales Manager"
    ]
  ],
  ["Marketing", ["Growth Hacker", "Marketing Manager", "Content Creator"]],
  ["Management", ["CEO", "CFO", "CMO", "COO", "CTO"]]
]);

export const INCLUDE_COOL_OFF_TIME = true;
export const COOL_OFF_TIME_IN_MINUTES = 10;

export const TURN_ON_ANALYCTIS_FOR_ENVIRONMENT = ["production"];
