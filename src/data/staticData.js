// ── Static demo data ─────────────────────────────────────────
// Seeded into AppContext on first render.
// Level 2 additions:
//   LOST_ITEMS      – unchanged shape (compatible with matcher)
//   FOUND_ITEMS     – added `recoveryStatus` field
//   MATCHED_ITEMS   – added lostId, foundId, confidence, score, reasons
//   CLAIMS          – added foundItemId, verificationDetails, rejectReason, resolvedOn
//   NOTIFICATIONS   – unchanged (still valid, context merges more at runtime)

export const LOST_ITEMS = [
  {
    id: "l1",
    type: "lost",
    title: "Blue North Face Backpack",
    category: "Bags",
    location: "Library – 2nd Floor",
    date: "2026-09-08",
    description: "Navy blue backpack with a broken left zipper. Has a small red keychain attached.",
    contact: "alex.m@university.edu",
  },
  {
    id: "l2",
    type: "lost",
    title: "AirPods Pro (White Case)",
    category: "Electronics",
    location: "Student Union Cafeteria",
    date: "2026-09-07",
    description: "White AirPods Pro charging case with initials 'S.K.' scratched on the back.",
    contact: "sara.k@university.edu",
  },
  {
    id: "l3",
    type: "lost",
    title: "Student ID Card",
    category: "Cards & IDs",
    location: "Engineering Building, Room 204",
    date: "2026-09-06",
    description: "University student ID for Jordan Lee, Class of 2027.",
    contact: "jordan.l@university.edu",
  },
  {
    id: "l4",
    type: "lost",
    title: "Black Umbrella",
    category: "Accessories",
    location: "Bus Stop near Dormitory A",
    date: "2026-09-05",
    description: "Compact black umbrella with a wooden handle. Brand: Repel.",
    contact: "priya.s@university.edu",
  },
];

export const FOUND_ITEMS = [
  {
    id: "f1",
    type: "found",
    title: "Silver MacBook Charger",
    category: "Electronics",
    location: "Science Lab 101",
    date: "2026-09-09",
    description: "Apple MagSafe USB-C charger, 61W. Left near the back workbench.",
    contact: "helpdesk@university.edu",
    // Level 2
    recoveryStatus: null,   // null | 'recovered'
    claimedBy: null,
  },
  {
    id: "f2",
    type: "found",
    title: "Green Water Bottle",
    category: "Accessories",
    location: "Gym – Locker Room",
    date: "2026-09-08",
    description: "Hydro Flask 32oz wide-mouth, forest green. Name 'Maya' written on the bottom.",
    contact: "gym.office@university.edu",
    recoveryStatus: null,
    claimedBy: null,
  },
  {
    id: "f3",
    type: "found",
    title: "Set of Keys (3 keys + fob)",
    category: "Keys",
    location: "Parking Lot C",
    date: "2026-09-07",
    description: "Honda key fob with two house keys on a yellow smiley-face keyring.",
    contact: "security@university.edu",
    // Pre-seeded as already recovered (matches CLAIMS c2 approved)
    recoveryStatus: "recovered",
    claimedBy: "Morgan Lee",
  },
  {
    id: "f4",
    type: "found",
    title: "Calculus Textbook",
    category: "Books",
    location: "Math Department Hallway",
    date: "2026-09-06",
    description: "'Calculus: Early Transcendentals' 8th ed. Name written inside front cover.",
    contact: "math.dept@university.edu",
    recoveryStatus: null,
    claimedBy: null,
  },
];

// Level 2: added lostId, foundId, confidence, score, reasons
export const MATCHED_ITEMS = [
  {
    id: "m1",
    type: "matched",
    lostId:    "l1",
    foundId:   "f2",
    lostTitle:  "Blue North Face Backpack",
    foundTitle: "Green Water Bottle",
    matchedOn:  "2026-09-09",
    status:     "pending_confirmation",
    // Matching details
    score:      0.30,
    confidence: "medium",
    reasons: [
      "Same category: Accessories",
      'Shared keywords: "broken"',
    ],
  },
  {
    id: "m2",
    type: "matched",
    lostId:    "l2",
    foundId:   "f1",
    lostTitle:  "AirPods Pro (White Case)",
    foundTitle: "Silver MacBook Charger",
    matchedOn:  "2026-09-08",
    status:     "confirmed",
    score:      0.65,
    confidence: "high",
    reasons: [
      "Same category: Electronics",
      'Shared keywords: "white", "silver"',
      "Found within 2 days of loss",
    ],
  },
];

// Level 2: added foundItemId, verificationDetails, rejectReason, resolvedOn
export const CLAIMS = [
  {
    id: "c1",
    foundItemId:  "f1",
    itemTitle:    "Silver MacBook Charger",
    claimant:     "Taylor Brooks",
    contact:      "taylor.b@university.edu",
    submittedOn:  "2026-09-09",
    status:       "pending",
    note:         "I left it in the Science Lab during my 10am session.",
    // Level 2 – ownership verification
    verificationDetails: {
      proofDescription: "It has a small blue sticker on the side with my initials 'T.B.'",
      serialOrMarkings:  "No serial number visible, Apple 61W USB-C",
      additionalContext: "I was in Chem lab at 10am on Sept 9th. Prof. Chen can confirm.",
    },
    rejectReason: null,
    resolvedOn:   null,
  },
  {
    id: "c2",
    foundItemId:  "f3",
    itemTitle:    "Set of Keys (3 keys + fob)",
    claimant:     "Morgan Lee",
    contact:      "morgan.l@university.edu",
    submittedOn:  "2026-09-08",
    status:       "approved",
    note:         "Honda Civic 2021. I can provide the registration.",
    verificationDetails: {
      proofDescription: "Honda Civic 2021, license plate KDA-4821. Yellow smiley-face keyring was a gift.",
      serialOrMarkings:  "Key fob has a scratch on the back-left corner",
      additionalContext: "I parked in Lot C on the morning of Sept 7th.",
    },
    rejectReason: null,
    resolvedOn:   "2026-09-09",
  },
  {
    id: "c3",
    foundItemId:  "f2",
    itemTitle:    "Green Water Bottle",
    claimant:     "Casey Rhodes",
    contact:      "casey.r@university.edu",
    submittedOn:  "2026-09-07",
    status:       "rejected",
    note:         "My bottle is dark green with 'Maya' on it.",
    verificationDetails: {
      proofDescription: "Hydro Flask 32oz, forest green. My name 'Maya' written in black marker on the bottom.",
      serialOrMarkings:  "Dent on the left side near the lid",
      additionalContext: "I use the gym every Tuesday morning.",
    },
    rejectReason: "Claimant's name does not match the name on the bottle.",
    resolvedOn:   "2026-09-08",
  },
  {
    id: "c4",
    foundItemId:  "f4",
    itemTitle:    "Calculus Textbook",
    claimant:     "Jamie Song",
    contact:      "jamie.s@university.edu",
    submittedOn:  "2026-09-06",
    status:       "pending",
    note:         "My name is written inside the front cover – Jamie Song.",
    verificationDetails: {
      proofDescription: "Name 'Jamie Song' written in blue ink on the inside front cover.",
      serialOrMarkings:  "ISBN 978-1-285-74062-1, highlighting in chapters 3 and 5",
      additionalContext: "I had Math 201 in the Math Dept hallway classroom on Sept 5th.",
    },
    rejectReason: null,
    resolvedOn:   null,
  },
];

export const NOTIFICATIONS = [
  {
    id: "n1",
    type: "match",
    message: "Your lost item 'Blue North Face Backpack' has a potential match!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "claim_approved",
    message: "Your claim for 'Set of Keys' has been approved. Visit the security office to collect.",
    time: "Yesterday",
    read: false,
  },
  {
    id: "n3",
    type: "claim_rejected",
    message: "Your claim for 'Green Water Bottle' was rejected. The description did not match.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "n4",
    type: "new_found",
    message: "A new found item 'Silver MacBook Charger' matches your lost report category.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "n5",
    type: "reminder",
    message: "Reminder: Your lost item report for 'Student ID Card' expires in 7 days.",
    time: "4 days ago",
    read: true,
  },
];

export const ADMIN_STATS = {
  totalLost:     42,
  totalFound:    38,
  totalMatched:  17,
  pendingClaims:  9,
  resolvedToday:  4,
};

export const CATEGORIES = [
  "All",
  "Electronics",
  "Bags",
  "Cards & IDs",
  "Keys",
  "Books",
  "Accessories",
  "Clothing",
  "Jewelry",
  "Other",
];

export const LOCATIONS = [
  "All",
  "Library",
  "Student Union",
  "Engineering Building",
  "Science Lab",
  "Gym",
  "Dormitory A",
  "Dormitory B",
  "Parking Lot C",
  "Math Department",
  "Cafeteria",
  "Bus Stop",
];
