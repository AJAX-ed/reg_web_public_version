// =============================================================================
// EVENT CONTENT CONFIGURATION (PLACEHOLDER — EDIT ME LATER)
// -----------------------------------------------------------------------------
// All user-facing event text lives here so you can update details without
// touching any component code. Replace the placeholders below when the final
// alumni details and venue information are available.
// =============================================================================

export const EVENT_CONFIG = {
  // Event identity
  name: "CYSCOM ALUMNI MEETUP",
  tagline: "Reconnect. Reflect. Reignite.", // shown under the title in the hero

  // ---- PLACEHOLDER event details (replace with real info) ------------------
  // NOTE: This is an ONLINE event. Date & time are to be announced later.
  dateLabel: "TBA",                     // TODO: real date when announced
  timeLabel: "Unspecified",             // TODO: real time when announced
  venueName: "Online Event",            // held virtually (e.g. Zoom / Meet)
  venueAddress: "",                     // not applicable for an online event
  isFree: true,                         // free event — no payments anywhere
  description:
    "An online gathering of memories, networking, and celebration for CYSCOM " +
    "alumni across every graduating class. Connect from anywhere — the exact " +
    "date and time will be announced soon. Registration is completely free.", // TODO: real description

  // Graduation years offered in the registration form dropdown.
  graduationYearStart: 1990,
  graduationYearEnd: new Date().getFullYear() + 1,

  // Contact shown in the footer (TODO: replace with organizer contact).
  contactEmail: "alumni@cyscom.example.com",
} as const;

// =============================================================================
// ALUMNI SHOWCASE DATA (PLACEHOLDER — EDIT ME LATER)
// -----------------------------------------------------------------------------
// The AlumniCarousel component renders one slide per entry in this array.
// To customize with real data later:
//   1. Replace `name` with the alumnus's real name.
//   2. Replace `description` with their bio / achievements.
//   3. Set `photoUrl` to an image path or URL (e.g. "/alumni/jane.jpg" placed
//      inside the public/ folder, or a full https:// URL). Leave it null/"" to
//      show the generic silhouette avatar placeholder instead.
//   4. Optionally add more fields (e.g. gradYear, jobTitle) and render them
//      in src/components/AlumniCarousel.tsx.
// Add or remove array entries freely — the carousel adapts automatically.
// =============================================================================
export interface AlumniProfile {
  name: string;
  description: string;
  /** Optional image path/URL. When empty, a placeholder avatar icon is shown. */
  photoUrl?: string | null;
}

export const ALUMNI_PROFILES: AlumniProfile[] = [
  {
    name: "ALUMNI",
    description:
      "This is the alumni details. Full bio and achievements will be added later.",
    photoUrl: null, // TODO: replace with a real photo path/URL
  },
  {
    name: "ALUMNI",
    description:
      "This is the alumni details. Full bio and achievements will be added later.",
    photoUrl: null, // TODO: replace with a real photo path/URL
  },
  {
    name: "ALUMNI",
    description:
      "This is the alumni details. Full bio and achievements will be added later.",
    photoUrl: null, // TODO: replace with a real photo path/URL
  },
];

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
