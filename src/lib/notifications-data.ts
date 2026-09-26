import { NotificationItem, NotificationPreferenceSetting } from "@/types/notifications";

// TODO: Replace INITIAL_NOTIFICATIONS mock data with dynamic Supabase queries once notification persistence table is provisioned.
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    type: "matches",
    title: "Cairo Derby Kickoff in 2 Hours! ⚽",
    message:
      "Al Ahly vs Zamalek SC kicks off at 20:00 EET at Cairo International Stadium. Stadium gates are now officially open for VIP & Category 1 badge holders.",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    timeAgo: "35m ago",
    read: false,
    priority: "high",
    actionUrl: "/events/zamalek-vs-ahly-basketball",
    actionLabel: "Match Hub & Gate Guide",
    meta: {
      venue: "Cairo International Stadium",
      eventDate: "Today, 20:00 EET",
      tag: "Match Day Live",
    },
  },
  {
    id: "notif-2",
    type: "tickets",
    title: "E-Ticket QR Code Ready for Entry 🎟️",
    message:
      "Your mobile ticket for Coldplay 'Music of the Spheres' Cairo Tour is confirmed and synced. Add to Apple Wallet or present the in-app QR code at Turnstile C.",
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // ~2 hours ago
    timeAgo: "2h ago",
    read: false,
    priority: "high",
    actionUrl: "/events/coldplay-live-cairo",
    actionLabel: "View E-Ticket",
    meta: {
      orderId: "TQ-94821",
      seat: "Section A1 - Row 4 - Seat 12",
      venue: "Giza Pyramids Plateau",
      tag: "Digital Pass",
    },
  },
  {
    id: "notif-3",
    type: "offers",
    title: "Flash 20% Off Weekend Sports Passes ⚡",
    message:
      "Use promo code TIQORASPORTS at checkout to receive 20% off all upcoming basketball, tennis, and football showdowns this weekend only.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    timeAgo: "5h ago",
    read: false,
    priority: "normal",
    actionUrl: "/events?category=sports",
    actionLabel: "Explore Sports Events",
    meta: {
      tag: "Limited Offer",
    },
  },
  {
    id: "notif-4",
    type: "matches",
    title: "Schedule Update: Egypt vs Nigeria Friendly ⏱️",
    message:
      "Official notice: Kickoff time for Egypt vs Nigeria has been moved 30 minutes forward to 20:30 EET due to international broadcast coordination.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // Yesterday
    timeAgo: "Yesterday",
    read: true,
    priority: "normal",
    actionUrl: "/events/egypt-vs-nigeria",
    actionLabel: "View Details",
    meta: {
      venue: "Borg El Arab Stadium",
      eventDate: "March 29, 20:30",
      tag: "Schedule Notice",
    },
  },
  {
    id: "notif-5",
    type: "tickets",
    title: "Booking Confirmed: Soundstorm 2025 🎶",
    message:
      "Payment of $145.00 confirmed for Soundstorm 2025 (3-Day General Admission). Your confirmation invoice has been sent to your registered email.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 1 day ago
    timeAgo: "1 day ago",
    read: true,
    priority: "normal",
    actionUrl: "/events/soundstorm-2025",
    actionLabel: "Order Receipt",
    meta: {
      orderId: "TQ-88301",
      tag: "Confirmed",
    },
  },
  {
    id: "notif-6",
    type: "security",
    title: "New Session Authenticated 🔒",
    message:
      "A successful sign-in was completed from Chrome on Windows (Cairo, Egypt). If this was not you, immediately review your active sessions in Security settings.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 52).toISOString(), // 2 days ago
    timeAgo: "2 days ago",
    read: true,
    priority: "normal",
    actionUrl: "/profile",
    actionLabel: "Security Settings",
    meta: {
      tag: "Account Security",
    },
  },
  {
    id: "notif-7",
    type: "offers",
    title: "Early Bird VIP Access: Cairo Marathon 2025 🏃‍♂️",
    message:
      "Early bird registration is officially open for the Cairo Half Marathon & 10K. Exclusive finisher medal and personalized bib kit included.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 75).toISOString(), // 3 days ago
    timeAgo: "3 days ago",
    read: true,
    priority: "low",
    actionUrl: "/events/cairo-marathon-2025",
    actionLabel: "Register Now",
    meta: {
      venue: "Zamalek Island, Cairo",
      eventDate: "April 18, 2025",
      tag: "Early Bird",
    },
  },
  {
    id: "notif-8",
    type: "tickets",
    title: "Seat Upgrade Opportunity: El Clasico Legends 🌟",
    message:
      "Exclusive option for Real Madrid vs Barcelona Legends ticket holders: Upgrade your standard seat to pitchside VIP lounge hospitality.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 98).toISOString(), // 4 days ago
    timeAgo: "4 days ago",
    read: true,
    priority: "low",
    actionUrl: "/events/real-madrid-vs-barcelona",
    actionLabel: "Check Upgrade",
    meta: {
      venue: "Cairo International Stadium",
      tag: "Exclusive Upgrade",
    },
  },
];

export const INITIAL_PREFERENCES: NotificationPreferenceSetting[] = [
  {
    id: "pref-match-kickoff",
    title: "Match Day & Kickoff Reminders",
    description: "Receive timely gate announcements, kickoff countdowns, and starting lineup alerts.",
    enabled: true,
    category: "matches",
  },
  {
    id: "pref-ticket-delivery",
    title: "Ticket Delivery & Gate QR Sync",
    description: "Real-time updates when e-tickets, barcode passes, or seat reassignments are ready.",
    enabled: true,
    category: "tickets",
  },
  {
    id: "pref-schedule-changes",
    title: "Event Reschedule & Venue Notices",
    description: "Urgent alerts if match dates, gate times, or venue guidelines change.",
    enabled: true,
    category: "matches",
  },
  {
    id: "pref-flash-discounts",
    title: "Exclusive Member Drops & Promo Codes",
    description: "Early access notifications for high-demand concert drops and flash sales.",
    enabled: true,
    category: "promos",
  },
  {
    id: "pref-security-alerts",
    title: "Account Security & Device Sign-ins",
    description: "Immediate safety alerts whenever a new login or password modification happens.",
    enabled: true,
    category: "security",
  },
];
