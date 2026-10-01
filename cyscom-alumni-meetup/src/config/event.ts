// =============================================================================
// EVENT CONTENT CONFIGURATION (PLACEHOLDER — EDIT ME LATER)
// -----------------------------------------------------------------------------
// All user-facing event text lives here so you can update details without
// touching any component code. Replace the placeholders below when the final
// alumni details, schedule, and venue information are available.
// =============================================================================

export const EVENT_CONFIG = {
  // Event identity
  name: "CYSCOM ALUMNI MEETUP",
  tagline: "Reconnect. Reflect. Reignite.", // shown under the title in the hero

  // ---- PLACEHOLDER event details (replace with real info) ------------------
  dateLabel: "Saturday, January 31, 2027", // TODO: real date
  timeLabel: "4:00 PM – 10:00 PM",          // TODO: real time
  venueName: "The Grand Hall, CYSCOM Campus", // TODO: real venue
  venueAddress: "123 Example Avenue, Your City", // TODO: real address
  isFree: true,                             // free event — no payments anywhere
  description:
    "An evening of memories, networking, and celebration for CYSCOM alumni " +
    "across every graduating class. Dinner, music, awards, and good company " +
    "await. Registration is completely free.", // TODO: real description

  // ---- PLACEHOLDER schedule (add/remove items freely) ----------------------
  schedule: [
    { time: "4:00 PM", item: "Registration & Welcome Tea" },   // TODO
    { time: "5:00 PM", item: "Opening Address by the Dean" },  // TODO
    { time: "6:00 PM", item: "Alumni Panel & Success Stories" },// TODO
    { time: "7:30 PM", item: "Dinner & Networking" },          // TODO
    { time: "9:00 PM", item: "Awards & Photo Session" },       // TODO
  ],

  // Graduation years offered in the registration form dropdown.
  graduationYearStart: 1990,
  graduationYearEnd: new Date().getFullYear() + 1,

  // Contact shown in the footer (TODO: replace with organizer contact).
  contactEmail: "alumni@cyscom.example.com",
} as const;

// Degree / department suggestions shown as datalist hints in the form.
// Free text is still allowed — these are just helpers. (TODO: extend list.)
export const DEGREE_SUGGESTIONS: string[] = [
  "B.Sc. Computer Science",
  "B.Sc. Information Technology",
  "B.Sc. Data Science",
  "BEng Electrical Engineering",
  "BEng Computer Engineering",
  "M.Sc. Computer Science",
  "MBA",
  "Other",
];
