// ── Static demo data ─────────────────────────────────────────
// All data is hard-coded for UI demonstration purposes only.

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
  },
];

export const MATCHED_ITEMS = [
  {
    id: "m1",
    type: "matched",
    lostTitle: "Blue North Face Backpack",
    foundTitle: "Blue Backpack with Red Keychain",
    matchedOn: "2026-09-09",
    status: "pending_confirmation",
  },
  {
    id: "m2",
    type: "matched",
    lostTitle: "AirPods Pro (White Case)",
    foundTitle: "White AirPods Case with Initials",
    matchedOn: "2026-09-08",
    status: "confirmed",
  },
];

export const CLAIMS = [
  {
    id: "c1",
    itemTitle: "Silver MacBook Charger",
    claimant: "Taylor Brooks",
    submittedOn: "2026-09-09",
    status: "pending",
    note: "I left it in the Science Lab during my 10am session.",
  },
  {
    id: "c2",
    itemTitle: "Set of Keys (3 keys + fob)",
    claimant: "Morgan Lee",
    submittedOn: "2026-09-08",
    status: "approved",
    note: "Honda Civic 2021. I can provide the registration.",
  },
  {
    id: "c3",
    itemTitle: "Green Water Bottle",
    claimant: "Casey Rhodes",
    submittedOn: "2026-09-07",
    status: "rejected",
    note: "My bottle is dark green with 'Maya' on it.",
  },
  {
    id: "c4",
    itemTitle: "Calculus Textbook",
    claimant: "Jamie Song",
    submittedOn: "2026-09-06",
    status: "pending",
    note: "My name is written inside the front cover – Jamie Song.",
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
  totalLost: 42,
  totalFound: 38,
  totalMatched: 17,
  pendingClaims: 9,
  resolvedToday: 4,
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
