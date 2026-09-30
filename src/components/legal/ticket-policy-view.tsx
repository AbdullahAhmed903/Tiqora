"use client";

import * as React from "react";
import {
  Ticket,
  QrCode,
  ShieldCheck,
  RotateCcw,
  Send,
  AlertOctagon,
  Users,
  Smartphone,
  Accessibility,
  Headphones,
} from "lucide-react";
import {
  PolicyLayout,
  PolicyHighlight,
  PolicySection,
  RelatedPolicyLink,
} from "@/components/legal/policy-layout";

export function TicketPolicyView() {
  const highlights: PolicyHighlight[] = [
    {
      title: "Encrypted QR Pass",
      desc: "Each ticket includes an anti-counterfeit dynamic QR code verified directly by stadium gate scanners.",
      icon: QrCode,
    },
    {
      title: "Rapid Turnstile Entry",
      desc: "Instant scanning at dedicated entry turnstiles ensures swift, seamless matchday admittance.",
      icon: Ticket,
    },
    {
      title: "100% Refund Guarantee",
      desc: "Automatic full refund for cancelled fixtures and preserved ticket validity for rescheduled dates.",
      icon: RotateCcw,
    },
    {
      title: "Seamless Fan Transfers",
      desc: "Easily transfer verified passes to friends and family with zero extra service surcharges.",
      icon: Send,
    },
  ];

  const sections: PolicySection[] = [
    {
      id: "digital-qr-system",
      number: "01",
      title: "Verified Digital QR Pass System",
      icon: QrCode,
      content: (
        <>
          <p>
            All tickets purchased through <strong>Tiqora</strong> are issued as secure digital passes featuring encrypted, time-synchronized QR codes and a unique reference code (format: <code className="font-mono text-blue-400">TIQ-######</code>).
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Anti-Counterfeit Protection:</strong> Traditional paper tickets and unverified screenshots are vulnerable to duplicate printing. Tiqora&apos;s dynamic QR passes eliminate counterfeit fraud.</li>
            <li><strong>Offline Wallet Access:</strong> Once generated in your Tiqora account, tickets can be added to your mobile wallet or accessed offline within our progressive web application.</li>
            <li><strong>Instant Email Dispatch:</strong> An encrypted PDF ticket copy with your official reference code is delivered to your registered email immediately upon payment confirmation.</li>
          </ul>
        </>
      ),
    },
    {
      id: "turnstile-entry",
      number: "02",
      title: "Stadium Turnstile & Gate Entry Standards",
      icon: ShieldCheck,
      content: (
        <>
          <p>
            To guarantee a secure and orderly matchday entry, ticket holders must adhere to the following admission standards:
          </p>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">1. Scanning Preparation:</strong>
              Present your QR pass on your mobile device screen with display brightness set to maximum, or present a clearly printed A4 paper ticket.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">2. Single-Scan Admission:</strong>
              Each barcode permits one entry scan only. Once scanned at the stadium turnstile, the ticket status updates to &quot;Entered&quot; across the central manifest and cannot be re-used.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">3. Physical Identification:</strong>
              For high-security fixtures (such as Cairo Derby or international tournaments), attendees must present a valid national ID card or passport corresponding to the ticket holder profile.
            </div>
          </div>
        </>
      ),
    },
    {
      id: "refunds-cancellations",
      number: "03",
      title: "Cancellations, Postponements & Refunds",
      icon: RotateCcw,
      content: (
        <>
          <p>
            Our consumer protection policy ensures fans are treated fairly whenever sports schedules or concert itineraries are disrupted:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li><strong>Postponed Fixtures:</strong> If a match is rescheduled to a later date, your existing ticket and QR code remain automatically valid for the new kickoff time. If you cannot attend the revised date, you may claim a full refund within 14 days of the announcement.</li>
            <li><strong>Cancelled Events:</strong> If an event is permanently cancelled without a replacement date, 100% of the ticket price and processing fees are automatically refunded to your original payment method. No action is required on your part.</li>
            <li><strong>Voluntary Fan Returns:</strong> Ticket refund requests for personal scheduling conflicts must be submitted via the Support Desk at least 48 hours prior to the scheduled gate opening time.</li>
          </ul>
        </>
      ),
    },
    {
      id: "ticket-transfers",
      number: "04",
      title: "Ticket Transfers & Name Re-assignment",
      icon: Send,
      content: (
        <>
          <p>
            Unable to attend the match? You can safely transfer your pass to another fan directly from your Tiqora account dashboard:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>Transfers are free of charge and re-generate a brand-new QR code for the recipient while invalidating the sender&apos;s previous barcode.</li>
            <li>The recipient must accept the transfer via their email link to confirm name registration on the gate manifest.</li>
            <li>To safeguard stadium logistics, ticket transfers close strictly <strong>2 hours prior to scheduled gate opening</strong>.</li>
          </ul>
        </>
      ),
    },
    {
      id: "prohibited-items",
      number: "05",
      title: "Prohibited Items & Fan Code of Conduct",
      icon: AlertOctagon,
      content: (
        <>
          <p>
            Tiqora, in cooperation with stadium authorities and sports federations, enforces a strict zero-tolerance policy against disruptive behavior and dangerous items:
          </p>
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/25 text-rose-300 text-xs space-y-2">
            <strong>Banned Items Strictly Confiscated at Security Checkpoints:</strong>
            <p>
              Pyrotechnics, flares, smoke bombs, fireworks, laser pointers, firearms, knives, glass bottles, canned drinks, rigid flagpoles exceeding 1 meter, and banners bearing political or discriminatory slogans.
            </p>
          </div>
          <p className="pt-1">
            Violators will be denied admission or ejected from the stadium premises immediately without refund, and may face stadium bans and civil prosecution under national sports security laws.
          </p>
        </>
      ),
    },
    {
      id: "child-admission",
      number: "06",
      title: "Age Requirements & Child Admission",
      icon: Users,
      content: (
        <>
          <p>
            Child admission guidelines depend on venue category and tournament organizer regulations:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>Children aged 3 and older require their own individual ticket and allocated seat.</li>
            <li>Infants under 3 years old may enter free of charge as &quot;lap infants&quot; provided they sit on an adult ticket holder&apos;s lap and do not occupy an additional seat.</li>
            <li>All minors under the age of 14 must be accompanied by an adult possessing a valid ticket at all times during the event.</li>
          </ul>
        </>
      ),
    },
    {
      id: "anti-scalping",
      number: "07",
      title: "Anti-Scalping & Black Market Enforcement",
      icon: ShieldCheck,
      content: (
        <>
          <p>
            Tickets purchased on Tiqora are for personal entertainment. Selling tickets on unauthorized third-party platforms, social media black markets, or outside stadium perimeters at inflated prices is strictly forbidden.
          </p>
          <p>
            Tiqora continuously scans secondary markets. Any tickets discovered on unauthorized resale listings will be cancelled immediately without reimbursement, and the associated accounts permanently restricted.
          </p>
        </>
      ),
    },
    {
      id: "inaccessible-passes",
      number: "08",
      title: "Lost, Damaged or Inaccessible Mobile Passes",
      icon: Smartphone,
      content: (
        <>
          <p>
            If your mobile device runs out of battery, experiences network connectivity issues, or is misplaced on matchday:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Tiqora Matchday Helpdesk:</strong> Visit the official Tiqora Customer Care kiosk located outside main stadium gates (Gates 1, 3, and 5 at major venues).</li>
            <li><strong>Re-issuance Requirements:</strong> Present your photo ID and confirmation reference number (<code className="font-mono text-blue-400">TIQ-######</code>). Our staff will verify your order on the live system and print an authorized emergency gate pass.</li>
          </ul>
        </>
      ),
    },
    {
      id: "accessibility",
      number: "09",
      title: "Accessible Seating & Special Assistance",
      icon: Accessibility,
      content: (
        <>
          <p>
            Tiqora is committed to providing equal, inclusive access for all sports fans:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li>Dedicated wheelchair-accessible bays and flat-level gate turnstiles are clearly labeled during ticket selection.</li>
            <li>Complimentary companion tickets are provided for registered fans with disabilities upon submission of valid disability verification cards.</li>
            <li>For special stadium escort assistance, please contact our support team at least 48 hours prior to kickoff.</li>
          </ul>
        </>
      ),
    },
    {
      id: "matchday-support",
      number: "10",
      title: "Matchday Support & Escalation Hotline",
      icon: Headphones,
      content: (
        <>
          <p>
            Encountering an issue at the turnstiles or have urgent booking questions? Our live matchday emergency desk is operational from 4 hours prior to kickoff through match conclusion:
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block">Matchday WhatsApp Hotline</span>
              <strong className="text-emerald-400 text-sm">+20 100 234 5678</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block">Gate Disputes &amp; Verification Desk</span>
              <strong className="text-blue-400 text-sm">support@tiqora.com</strong>
            </div>
          </div>
        </>
      ),
    },
  ];

  const relatedLinks: RelatedPolicyLink[] = [
    {
      title: "Terms of Service",
      href: "/terms",
      desc: "Complete legal agreement covering ticket booking contracts, platform usage, and user liabilities.",
    },
    {
      title: "Privacy Policy",
      href: "/privacy",
      desc: "Learn how your personal details, payment receipts, and ticket data are securely handled.",
    },
    {
      title: "Frequently Asked Questions",
      href: "/faqs",
      desc: "Browse our comprehensive knowledge base for quick answers on refunds, tickets, and gates.",
    },
    {
      title: "Contact Support Desk",
      href: "/contact",
      desc: "Direct access to our customer care team via online message, WhatsApp, or phone.",
    },
  ];

  return (
    <PolicyLayout
      badge="Stadium & Admission"
      badgeIcon={<Ticket className="w-3.5 h-3.5 text-blue-400" />}
      title="Ticket & Admission Policy"
      subtitle="Essential guidelines for verified digital QR passes, turnstile scanning, stadium gate regulations, refunds, and fan safety conduct."
      lastUpdated="September 30, 2026"
      highlights={highlights}
      sections={sections}
      relatedLinks={relatedLinks}
    />
  );
}
