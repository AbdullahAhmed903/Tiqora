"use client";

import * as React from "react";
import {
  Scale,
  ShieldCheck,
  CreditCard,
  Ticket,
  AlertTriangle,
  FileText,
  UserCheck,
  Building,
  RotateCcw,
  Gavel,
  HelpCircle,
} from "lucide-react";
import {
  PolicyLayout,
  PolicyHighlight,
  PolicySection,
  RelatedPolicyLink,
} from "@/components/legal/policy-layout";

export function TermsView() {
  const highlights: PolicyHighlight[] = [
    {
      title: "Authorized Ticketing",
      desc: "Direct integration with stadiums, leagues, and official event organizers worldwide.",
      icon: Ticket,
    },
    {
      title: "Transparent Pricing",
      desc: "All ticket prices, facility fees, and taxes are clearly disclosed before checkout.",
      icon: CreditCard,
    },
    {
      title: "Anti-Scalping Protection",
      desc: "Zero tolerance for black market resale, automated scalping bots, or barcode spoofing.",
      icon: ShieldCheck,
    },
    {
      title: "Guaranteed Resolution",
      desc: "Full automatic refunds for cancelled events and valid ticket preservation for rescheduled dates.",
      icon: RotateCcw,
    },
  ];

  const sections: PolicySection[] = [
    {
      id: "acceptance",
      number: "01",
      title: "Acceptance of Agreement & Eligibility",
      icon: Scale,
      content: (
        <>
          <p>
            Welcome to <strong>Tiqora</strong>. By accessing our platform, creating an account, or purchasing digital tickets, you agree to be legally bound by these Terms of Service, our Privacy Policy, and our Ticket &amp; Admission Policy.
          </p>
          <p>
            You must be at least 18 years old or possess legal parental/guardian consent to enter into binding agreements and purchase tickets on Tiqora. If you are accepting these terms on behalf of a sports club, company, or event organizing entity, you represent and warrant that you possess full corporate authorization.
          </p>
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-blue-300 text-xs">
            <strong>Key Note:</strong> If you disagree with any provision in these Terms, you must discontinue platform usage and refrain from purchasing or claiming event tickets through our services.
          </div>
        </>
      ),
    },
    {
      id: "accounts",
      number: "02",
      title: "User Accounts & Security Obligations",
      icon: UserCheck,
      content: (
        <>
          <p>
            To access purchased tickets, transfer passes, or manage stadium gate privileges, users must register an authenticated account. You agree to provide accurate, current, and verifiable contact details, including your full legal name, phone number, and email address.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>You are solely responsible for maintaining the confidentiality of your credentials and authentication tokens.</li>
            <li>Accounts suspected of credential stuffing, multiple identity fabrication, or unauthorized automated access will be suspended immediately.</li>
            <li>You agree to notify Tiqora Customer Support immediately if you detect unauthorized access or security breaches affecting your profile.</li>
          </ul>
        </>
      ),
    },
    {
      id: "purchases-pricing",
      number: "03",
      title: "Ticket Purchases, Pricing & Payment Terms",
      icon: CreditCard,
      content: (
        <>
          <p>
            Ticket pricing, seat categorization (e.g. VIP Box, Main Stand, Fan Terrace), and booking availability are established in direct cooperation with participating clubs and event hosts.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Currency &amp; Checkout:</strong> All orders are billed in the stated currency (EGP or USD) including applicable value-added taxes and standard platform processing fees.</li>
            <li><strong>Payment Gateways:</strong> Transactions are securely processed through certified payment providers, including Stripe. Tiqora does not store or process raw credit card CVV data.</li>
            <li><strong>Order Confirmation:</strong> An order is finalized only after successful payment clearance and the generation of an official reference number (format: <code className="font-mono text-blue-400">TIQ-######</code>).</li>
          </ul>
        </>
      ),
    },
    {
      id: "anti-scalping",
      number: "04",
      title: "Anti-Scalping & Unauthorized Resale Bans",
      icon: AlertTriangle,
      content: (
        <>
          <p>
            Tiqora enforces stringent anti-scalping policies to ensure authentic fans enjoy fair, affordable access to sports and cultural events:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Commercial Resale Ban:</strong> Reselling Tiqora passes on unauthorized secondary marketplaces at inflated prices is strictly prohibited.</li>
            <li><strong>Bot Prohibition:</strong> Using automated scripts, scrapers, browser extensions, or automated purchasing bots to bypass queue limits or acquire ticket allotments results in immediate account bans.</li>
            <li><strong>Ticket Invalidation:</strong> Tiqora reserves the right to void tickets detected on black market listings without reimbursement, rendering the corresponding QR codes invalid at the venue turnstiles.</li>
          </ul>
        </>
      ),
    },
    {
      id: "stadium-admission",
      number: "05",
      title: "Stadium Admission & Turnstile Regulations",
      icon: Ticket,
      content: (
        <>
          <p>
            Possession of a Tiqora digital pass grants revocable admission to the designated event venue, subject to the following entry standards:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Digital QR Pass:</strong> Each pass includes a high-security encrypted QR code that must be presented on a mobile device or printed voucher at stadium turnstiles.</li>
            <li><strong>Single Entry Validation:</strong> Each barcode is strictly valid for one admission scan. Duplicating or forwarding used barcodes will trigger turnstile rejection alarms.</li>
            <li><strong>ID Verification:</strong> Stadium security personnel and stadium stewards may request official government-issued photo identification matching the ticket holder name.</li>
            <li><strong>Venue Code of Conduct:</strong> Attendees must observe all venue regulations. Failure to comply with safety directives, possession of banned items, or aggressive behavior may lead to immediate eviction without refund.</li>
          </ul>
        </>
      ),
    },
    {
      id: "cancellations-refunds",
      number: "06",
      title: "Cancellations, Postponements & Refunds",
      icon: RotateCcw,
      content: (
        <>
          <p>
            Sports schedules and live entertainment can occasionally encounter fixture changes due to weather conditions, league rulings, or public security determinations:
          </p>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">Rescheduled Matches / Events:</strong>
              If an event is postponed, existing tickets automatically remain valid for the new date and time. If you cannot attend the rescheduled date, you may request a refund within 14 calendar days of the announcement.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">Cancelled Events (No Reschedule):</strong>
              If an event is permanently cancelled by the league or organizer without a replacement date, ticket holders receive a 100% automatic refund credited back to their original payment method within 7–10 business days.
            </div>
          </div>
        </>
      ),
    },
    {
      id: "organizers",
      number: "07",
      title: "Event Organizers & Hosting Partners",
      icon: Building,
      content: (
        <>
          <p>
            Event organizers and sports clubs utilizing Tiqora agree to maintain accurate event descriptions, seating diagrams, kickoff times, and admission prerequisites.
          </p>
          <p>
            Organizers are solely responsible for obtaining all necessary municipal permits, safety compliance certifications, security coordination with police and stadium authorities, and the physical execution of the event.
          </p>
        </>
      ),
    },
    {
      id: "ip-rights",
      number: "08",
      title: "Intellectual Property Rights",
      icon: FileText,
      content: (
        <>
          <p>
            All content, brand assets, logos, graphic user interfaces, software code, dynamic algorithms, and ticket design templates on Tiqora are the exclusive intellectual property of Tiqora Inc. and its licensors.
          </p>
          <p>
            Users are granted a limited, personal, non-exclusive, non-transferable license to access the platform for the sole purpose of browsing and purchasing tickets. You may not decompile, scrape, copy, or commercially exploit any platform materials without prior written consent.
          </p>
        </>
      ),
    },
    {
      id: "liability",
      number: "09",
      title: "Disclaimer of Warranties & Limitation of Liability",
      icon: Gavel,
      content: (
        <>
          <p>
            Tiqora provides its ticketing software and services on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied.
          </p>
          <p>
            To the maximum extent permitted by applicable law, Tiqora, its directors, and affiliates shall not be liable for any indirect, punitive, incidental, or consequential damages arising out of event cancellations by organizers, stadium security actions, lost personal belongings at venues, or third-party turnstile equipment outages.
          </p>
        </>
      ),
    },
    {
      id: "governing-law",
      number: "10",
      title: "Governing Law & Customer Support",
      icon: HelpCircle,
      content: (
        <>
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of Egypt and applicable regional commercial standards, without regard to conflict of law principles.
          </p>
          <p>
            If you have questions, disputes, or require clarification regarding these terms, our support desk is standing by to assist:
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block">Customer Care Hotline</span>
              <strong className="text-white text-sm">+20 100 234 5678</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block">Official Support Email</span>
              <strong className="text-blue-400 text-sm">support@tiqora.com</strong>
            </div>
          </div>
        </>
      ),
    },
  ];

  const relatedLinks: RelatedPolicyLink[] = [
    {
      title: "Privacy Policy",
      href: "/privacy",
      desc: "Learn how we handle and protect your personal records, payment data, and match history.",
    },
    {
      title: "Ticket & Admission Policy",
      href: "/ticket-policy",
      desc: "Detailed guidelines for digital QR pass validation, turnstile entry, and fan stadium conduct.",
    },
    {
      title: "Frequently Asked Questions",
      href: "/faqs",
      desc: "Quick answers to common questions about ticket refunds, pass transfers, and matchday tips.",
    },
    {
      title: "Contact Support Desk",
      href: "/contact",
      desc: "Direct access to our customer care team via online message, WhatsApp, or phone.",
    },
  ];

  return (
    <PolicyLayout
      badge="Legal & Governance"
      badgeIcon={<Scale className="w-3.5 h-3.5 text-blue-400" />}
      title="Terms of Service"
      subtitle="Please review the legal terms and operating conditions governing your use of Tiqora, our sports ticketing platform, and digital event passes."
      lastUpdated="September 30, 2026"
      highlights={highlights}
      sections={sections}
      relatedLinks={relatedLinks}
    />
  );
}
