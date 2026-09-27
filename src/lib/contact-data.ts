import { ContactDepartmentOption } from "@/types/contact";

export const CONTACT_DEPARTMENTS: ContactDepartmentOption[] = [
  {
    id: "tickets",
    label: "Tickets & Digital QR Passes",
    description: "Seat changes, missing QR codes, ticket transfers & gate scanning issues",
    iconName: "Ticket",
  },
  {
    id: "payments",
    label: "Payments, Billing & Refunds",
    description: "Payment errors, refund requests, invoices & Stripe billing questions",
    iconName: "CreditCard",
  },
  {
    id: "stadium",
    label: "Stadium Entry & Gate Access",
    description: "Venue gates, Fan ID verification, security regulations & accessibility",
    iconName: "ShieldCheck",
  },
  {
    id: "organizers",
    label: "Organizer & Event Hosting",
    description: "Publishing a match or tournament, promoter payouts & corporate partnerships",
    iconName: "Trophy",
  },
  {
    id: "technical",
    label: "Account & Technical Support",
    description: "Login issues, two-factor authentication, mobile app bugs & notifications",
    iconName: "Wrench",
  },
  {
    id: "general",
    label: "General Inquiries & Feedback",
    description: "Platform feedback, sponsorship, press inquiries & general questions",
    iconName: "HelpCircle",
  },
];

export const COUNTRY_CODES = [
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
];

export const SUPPORT_STATS = [
  {
    label: "Average Response Time",
    value: "< 15 Mins",
    description: "During live football matches & events",
  },
  {
    label: "Matchday Coverage",
    value: "24 / 7",
    description: "Dedicated gate assistance & hotline",
  },
  {
    label: "Fan Satisfaction",
    value: "99.4%",
    description: "Across 45,000+ tickets resolved",
  },
];
