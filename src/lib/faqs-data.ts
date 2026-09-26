import { FaqItem, FaqCategoryConfig, FaqTopicHighlight } from "@/types/faqs";

export const FAQ_CATEGORIES: FaqCategoryConfig[] = [
  {
    id: "all",
    label: "All Questions",
    iconName: "HelpCircle",
    description: "Browse our complete knowledge base across all categories.",
  },
  {
    id: "tickets",
    label: "Tickets & Passes",
    iconName: "Ticket",
    description: "Digital QR passes, delivery, seating tiers, and transfers.",
  },
  {
    id: "stadium",
    label: "Match Day & Gates",
    iconName: "Trophy",
    description: "Gate access, opening times, security guidelines, and venues.",
  },
  {
    id: "payments",
    label: "Payments & Refunds",
    iconName: "CreditCard",
    description: "Payment options, Stripe checkout, cancellations, and refunds.",
  },
  {
    id: "account",
    label: "Account & Safety",
    iconName: "ShieldCheck",
    description: "Profile management, genuine ticket guarantees, and credentials.",
  },
  {
    id: "organizers",
    label: "Organizers & Hosts",
    iconName: "Users",
    description: "Listing events, ticket validation, analytics, and payouts.",
  },
];

export const FAQ_TOPIC_HIGHLIGHTS: FaqTopicHighlight[] = [
  {
    id: "topic-digital-pass",
    title: "100% Digital Entry",
    description: "No paper printouts needed. Instant QR code entry synced to your Tiqora wallet.",
    category: "tickets",
    iconName: "Smartphone",
  },
  {
    id: "topic-buyer-guarantee",
    title: "Verified Guarantee",
    description: "Every ticket is cryptographically verified to ensure authentic, valid entry.",
    category: "account",
    iconName: "ShieldCheck",
  },
  {
    id: "topic-match-refunds",
    title: "Protected Refunds",
    description: "Automatic full refunds if a match or live show is officially postponed or cancelled.",
    category: "payments",
    iconName: "RotateCcw",
  },
  {
    id: "topic-gate-assistance",
    title: "Match Day Concierge",
    description: "On-site customer marshals and live support ready to assist at every major venue.",
    category: "stadium",
    iconName: "Headphones",
  },
];

export const POPULAR_SEARCH_TAGS = [
  "Refund policy",
  "Digital QR pass",
  "Transfer tickets",
  "Cairo Derby gates",
  "Payment methods",
  "Organizer payouts",
  "Lost ticket",
];

export const FAQS_LIST: FaqItem[] = [
  // --- Tickets & Passes ---
  {
    id: "faq-1",
    category: "tickets",
    question: "How do I receive and access my match or concert tickets?",
    answer:
      "All tickets on Tiqora are 100% digital. As soon as your payment is processed, your encrypted QR code pass is automatically generated and added to your 'My Tickets' dashboard. You also receive an email confirmation with an attached PDF pass and an option to save directly to Apple Wallet or Google Wallet.",
    popular: true,
    tags: ["digital pass", "qr code", "delivery", "apple wallet"],
  },
  {
    id: "faq-2",
    category: "tickets",
    question: "Can I transfer or send a ticket to a friend or family member?",
    answer:
      "Yes! You can securely transfer tickets directly from your 'My Tickets' dashboard up to 2 hours before the scheduled kickoff or event start time. Simply select the ticket, click 'Transfer', and enter the recipient's registered email address. The recipient will receive a new unique QR code, and your original pass will be safely deactivated.",
    popular: true,
    tags: ["transfer", "send ticket", "friends", "gift"],
  },
  {
    id: "faq-3",
    category: "tickets",
    question: "Do I need to print my ticket, or can I scan directly from my smartphone?",
    answer:
      "You do not need to print anything! Stadium and venue turnstiles are equipped with high-speed optical scanners that read digital QR passes straight from your mobile screen. Simply ensure your phone display brightness is turned up when approaching the turnstile.",
    popular: false,
    tags: ["paperless", "turnstiles", "mobile scan"],
  },
  {
    id: "faq-4",
    category: "tickets",
    question: "How does reserved seating versus general admission work?",
    answer:
      "When purchasing tickets for sports matches (such as football derbies or basketball showdowns) and seated theater productions, our interactive seat map displays available rows, sections, and tiers (VIP, Category 1, Category 2). General Admission or standing pit tickets (common for music festivals and concerts) grant open standing access within the designated zone on a first-come, first-served basis.",
    popular: false,
    tags: ["seat map", "vip", "standing", "categories"],
  },

  // --- Match Day & Gates ---
  {
    id: "faq-5",
    category: "stadium",
    question: "What time do stadium gates open before match kickoff?",
    answer:
      "For high-profile football matches (such as the Cairo Derby Al Ahly vs Zamalek or national team fixtures), gates typically open 3 to 4 hours prior to kickoff to ensure comfortable entry and security screening. For standard concerts and festivals, doors usually open 2 hours before the first performance. Your digital pass and event page always state the official gate opening time.",
    popular: true,
    tags: ["gate opening", "kickoff", "stadium arrival", "derby"],
  },
  {
    id: "faq-6",
    category: "stadium",
    question: "What items are strictly prohibited inside stadiums and concert arenas?",
    answer:
      "To safeguard all attendees, venues prohibit fireworks, flares, laser pointers, professional camera rigs with detachable telephoto lenses (without press accreditation), glassware, and unauthorized promotional banners. Sealed personal water bottles without caps are generally permitted subject to specific venue rules.",
    popular: false,
    tags: ["security", "prohibited items", "cameras", "flares"],
  },
  {
    id: "faq-7",
    category: "stadium",
    question: "What should I do if my phone battery dies or I lose connection at the gate?",
    answer:
      "Don't worry! Every major venue has a designated Tiqora On-Site Resolution Booth located adjacent to the primary turnstiles. Simply present your valid national photo ID or passport, and our support team can verify your booking identity on the master attendee ledger and issue an emergency wristband or printed entry voucher.",
    popular: true,
    tags: ["battery died", "no internet", "id resolution", "help desk"],
  },
  {
    id: "faq-8",
    category: "stadium",
    question: "Is venue parking included with my ticket purchase?",
    answer:
      "Standard tickets do not include reserved stadium parking unless specified as a 'VIP Hospitality & Parking Pass'. Most major venues (like Cairo International Stadium and Borg El Arab) feature public surrounding parking zones operated on a local daily rate.",
    popular: false,
    tags: ["parking", "transport", "vip parking"],
  },

  // --- Payments & Refunds ---
  {
    id: "faq-9",
    category: "payments",
    question: "What payment methods are supported on Tiqora?",
    answer:
      "We process payments securely via Stripe, supporting all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and local regional payment networks. All transactions are protected with bank-grade 256-bit SSL encryption and 3D Secure 2 authentication.",
    popular: true,
    tags: ["stripe", "visa", "mastercard", "apple pay", "security"],
  },
  {
    id: "faq-10",
    category: "payments",
    question: "What is the refund policy if an event or match is postponed or cancelled?",
    answer:
      "If an event is officially cancelled by the organizers or federation, 100% of your ticket face value and service fees are automatically refunded to your original payment method. If a match is rescheduled to a new date, your tickets remain automatically valid for the rescheduled date. If you cannot attend the new date, you may request a full refund within 7 calendar days of the announcement.",
    popular: true,
    tags: ["cancellation", "reschedule", "automatic refund", "buyer guarantee"],
  },
  {
    id: "faq-11",
    category: "payments",
    question: "Are there any hidden fees or extra booking charges at checkout?",
    answer:
      "Never. Tiqora believes in radical pricing transparency. The price you see on the event tier is clearly itemized before you enter your payment details, including any mandatory municipal facility taxes or card processing fees. What you see is exactly what you pay.",
    popular: false,
    tags: ["pricing", "transparent", "fees", "taxes"],
  },
  {
    id: "faq-12",
    category: "payments",
    question: "How long does it take for a refund to reflect in my bank account?",
    answer:
      "Once a refund is triggered, funds are dispatched immediately from our Stripe merchant account. Depending on your issuing financial institution or card provider, the credit will appear on your bank statement within 5 to 10 business days.",
    popular: false,
    tags: ["payout time", "bank delay", "statement"],
  },

  // --- Account & Safety ---
  {
    id: "faq-13",
    category: "account",
    question: "How does Tiqora guarantee that tickets are 100% genuine and verified?",
    answer:
      "Tiqora works in direct partnership with official football clubs, sports federations, and authorized event promoters. Every ticket issued is signed with a dynamic cryptographic hash that refreshes periodically, preventing duplicate photocopies, fake scalper screenshots, or unauthorized reselling.",
    popular: true,
    tags: ["fraud prevention", "anti-scalping", "official partner", "genuine"],
  },
  {
    id: "faq-14",
    category: "account",
    question: "How do I update my profile details or manage my security settings?",
    answer:
      "You can update your display name, contact phone number, and avatar by visiting your 'Profile' page. If you signed up using email and password, you can update your password under the 'Security & Access' tab. If you signed in via Google OAuth, your credentials are authenticated directly by Google.",
    popular: false,
    tags: ["profile", "password", "google login", "security"],
  },
  {
    id: "faq-15",
    category: "account",
    question: "Can I follow favorite teams or artists to receive instant drop notifications?",
    answer:
      "Yes! Simply click the Heart icon on any sports match, festival, or concert page to add it to your Favorites. You will automatically receive push and in-app alerts on your Notifications page whenever kickoffs approach, ticket batches drop, or special discounts go live.",
    popular: false,
    tags: ["favorites", "alerts", "notifications", "watchlist"],
  },

  // --- Organizers & Hosts ---
  {
    id: "faq-16",
    category: "organizers",
    question: "How do I become an approved organizer to publish events on Tiqora?",
    answer:
      "Organizations, sports academies, tournament directors, and promoters can apply through our Organizer Portal. After submitting company registration and identity credentials, our compliance team reviews and verifies accounts within 24 to 48 hours to activate ticket sales and custom ticketing tiers.",
    popular: false,
    tags: ["host event", "organizer application", "verification", "portal"],
  },
  {
    id: "faq-17",
    category: "organizers",
    question: "What tools does Tiqora provide for turnstile gate check-in on event day?",
    answer:
      "Approved organizers gain access to the Tiqora Gate Scanner mobile application (available for iOS & Android) and web console. Gate marshals can scan hundreds of QR codes per minute in offline and online modes, preventing fraud and providing live entry analytics.",
    popular: false,
    tags: ["gate scanner", "check-in", "qr reader", "offline mode"],
  },
  {
    id: "faq-18",
    category: "organizers",
    question: "When and how are organizer ticket proceeds paid out?",
    answer:
      "Ticket sales revenue is accumulated in your Stripe Connected Account. Organizers can configure automated daily, weekly, or post-event payouts directly to their corporate bank account with transparent accounting reconciliations and downloadable invoices.",
    popular: false,
    tags: ["payouts", "stripe connected", "accounting", "revenue"],
  },
];
