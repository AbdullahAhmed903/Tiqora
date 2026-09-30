"use client";

import * as React from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  Database,
  Cookie,
  Server,
  Trash2,
  Globe,
  Mail,
  FileCheck,
} from "lucide-react";
import {
  PolicyLayout,
  PolicyHighlight,
  PolicySection,
  RelatedPolicyLink,
} from "@/components/legal/policy-layout";

export function PrivacyView() {
  const highlights: PolicyHighlight[] = [
    {
      title: "Bank-Grade Encryption",
      desc: "All personal information and ticket metadata are encrypted using AES-256 and TLS 1.3.",
      icon: Lock,
    },
    {
      title: "No Data Selling",
      desc: "We strictly never sell or rent your personal contact information to third-party advertisers.",
      icon: EyeOff,
    },
    {
      title: "PCI-DSS Compliant",
      desc: "Credit card transactions are processed through Stripe; raw card details are never stored on Tiqora.",
      icon: ShieldCheck,
    },
    {
      title: "Full User Control",
      desc: "Easily update your preferences, request a portable data export, or permanently delete your profile.",
      icon: UserCheck,
    },
  ];

  const sections: PolicySection[] = [
    {
      id: "introduction",
      number: "01",
      title: "Introduction & Privacy Commitment",
      icon: ShieldCheck,
      content: (
        <>
          <p>
            At <strong>Tiqora</strong>, we respect your fundamental right to privacy and are committed to maintaining transparent data management practices. This Privacy Policy details how we collect, store, process, and protect your information across our website, mobile interfaces, and digital stadium ticketing services.
          </p>
          <p>
            By using Tiqora to browse fixtures, reserve match tickets, or submit customer support inquiries, you consent to the data practices outlined in this policy.
          </p>
        </>
      ),
    },
    {
      id: "data-collection",
      number: "02",
      title: "Information We Collect",
      icon: Database,
      content: (
        <>
          <p>
            We collect only the minimum necessary information required to authenticate fans, process ticket reservations, and safeguard stadium turnstile access:
          </p>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">1. Personal Profile Data:</strong>
              When registering an account, we collect your full legal name, email address, phone number with country code, and optional profile avatar.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">2. Transactional &amp; Booking History:</strong>
              Records of purchased matches, stadium sections, ticket tier categories, payment confirmation reference numbers, and digital QR pass issuance timestamps.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">3. Customer Support Inquiries:</strong>
              When contacting support or submitting dispute requests, we collect your message text, inquiry department, phone number, and any uploaded image or PDF document proofs.
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
              <strong className="text-white block pb-1">4. Technical &amp; Device Information:</strong>
              IP address (used strictly for dual-tier rate limiting and geo-availability), browser type, operating system, and session timestamps.
            </div>
          </div>
        </>
      ),
    },
    {
      id: "data-usage",
      number: "03",
      title: "How We Use Your Information",
      icon: FileCheck,
      content: (
        <>
          <p>
            Your information is utilized strictly to deliver, optimize, and protect the ticketing experience:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Ticket Generation &amp; Delivery:</strong> Issuing encrypted digital QR passes and transmitting instant order confirmations via email.</li>
            <li><strong>Gate Verification:</strong> Synchronizing ticket manifests with stadium turnstile scanners to allow rapid, validated entry on match day.</li>
            <li><strong>Platform Security &amp; Anti-Fraud:</strong> Enforcing rate limiters, monitoring suspicious account creation bots, and verifying that ticket allocations remain fair.</li>
            <li><strong>Transactional Communications:</strong> Providing critical updates regarding match rescheduling, gate changes, refund statuses, and security notifications.</li>
          </ul>
        </>
      ),
    },
    {
      id: "third-parties",
      number: "04",
      title: "Third-Party Service Providers & Sharing",
      icon: Server,
      content: (
        <>
          <p>
            Tiqora collaborates with trusted, industry-leading infrastructure partners to power our platform. We only share the minimum data necessary for specific technical operations:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-zinc-300">
            <li><strong>Payment Gateways (Stripe):</strong> Customer payment sessions are processed directly through Stripe under PCI-DSS Level 1 compliance. Tiqora never sees or stores full payment card numbers or security CVVs.</li>
            <li><strong>Cloud Infrastructure (Supabase):</strong> Encrypted databases and private storage buckets are hosted on secure Supabase cloud infrastructure protected by Row Level Security (RLS).</li>
            <li><strong>Transactional Email (Resend):</strong> Notification emails and purchase receipts are dispatched via secure, encrypted SMTP/API connections.</li>
            <li><strong>Stadium Gate Operators:</strong> Validated ticket reference codes and attendee names are shared with venue stewards solely for admittance confirmation.</li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies",
      number: "05",
      title: "Cookie Policy & Tracking Technologies",
      icon: Cookie,
      content: (
        <>
          <p>
            Tiqora utilizes essential and functional cookies to ensure platform reliability and security:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Essential Authentication Cookies:</strong> Secure, HTTP-only session tokens (<code className="font-mono text-blue-400">sb-*</code>) that keep you safely authenticated as you navigate routes.</li>
            <li><strong>Security Cookies:</strong> Temporary tokens used to prevent Cross-Site Request Forgery (CSRF) and anti-bot honeypot evaluation.</li>
            <li><strong>No Tracking Ad Cookies:</strong> We do not deploy third-party advertising cookies, retargeting pixels, or behavioral tracking networks across our application.</li>
          </ul>
        </>
      ),
    },
    {
      id: "security-standards",
      number: "06",
      title: "Data Security & Encryption Architecture",
      icon: Lock,
      content: (
        <>
          <p>
            We deploy multi-layered defense standards to safeguard your data against unauthorized access, loss, or alteration:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Encryption in Transit:</strong> All communication between your client device and Tiqora servers is encrypted using modern TLS 1.3 protocols.</li>
            <li><strong>Encryption at Rest:</strong> Database records, user profiles, and storage attachments are stored with AES-256 encryption.</li>
            <li><strong>Strict Database RLS:</strong> Row Level Security policies guarantee that users can only query their own ticket records and private data.</li>
            <li><strong>Expiring Signed URLs:</strong> Private attachments in support cases are served exclusively via temporary, 1-hour signed tokens.</li>
          </ul>
        </>
      ),
    },
    {
      id: "retention-deletion",
      number: "07",
      title: "Data Retention & Account Deletion",
      icon: Trash2,
      content: (
        <>
          <p>
            We retain personal information only for as long as necessary to fulfill event ticketing obligations, adhere to statutory accounting standards, and resolve disputes.
          </p>
          <p>
            Users may request permanent deletion of their account profile and associated personal data at any time through their Profile Settings or by emailing <code className="font-mono text-blue-400">privacy@tiqora.com</code>. Deletion removes all personal identifiers from our production systems within 30 calendar days.
          </p>
        </>
      ),
    },
    {
      id: "user-rights",
      number: "08",
      title: "Your Privacy Rights & Controls",
      icon: Globe,
      content: (
        <>
          <p>
            Regardless of your geographic location, Tiqora provides robust data privacy rights aligned with GDPR and global privacy benchmarks:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-zinc-300">
            <li><strong>Right to Access:</strong> Request a comprehensive copy of all personal records associated with your account.</li>
            <li><strong>Right to Rectification:</strong> Edit and correct incomplete or outdated personal information via your account dashboard.</li>
            <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request permanent deletion of non-essential records.</li>
            <li><strong>Right to Restrict Processing:</strong> Limit the scope of data utilization in the event of active disputes.</li>
          </ul>
        </>
      ),
    },
    {
      id: "children-privacy",
      number: "09",
      title: "Protection of Minors",
      icon: UserCheck,
      content: (
        <>
          <p>
            Tiqora services are not directed at children under the age of 13. We do not knowingly solicit or collect personally identifiable information from children under 13 without verified parental consent. If we discover that personal data of a minor has been collected without appropriate consent, we immediately purge the data from our repositories.
          </p>
        </>
      ),
    },
    {
      id: "contact-dpo",
      number: "10",
      title: "Privacy Inquiries & Data Protection Contact",
      icon: Mail,
      content: (
        <>
          <p>
            For questions, concerns, or requests regarding this Privacy Policy or your personal records, please reach out to our dedicated Data Protection team:
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block">Data Protection Office</span>
              <strong className="text-blue-400 text-sm">privacy@tiqora.com</strong>
            </div>
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
              <span className="text-zinc-500 block">General Support Inquiries</span>
              <strong className="text-white text-sm">support@tiqora.com</strong>
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
      desc: "Review the governing legal agreement for ticket purchases, stadium entry, and user accounts.",
    },
    {
      title: "Ticket & Admission Policy",
      href: "/ticket-policy",
      desc: "Guidelines on verified digital QR passes, turnstile entry, and fan stadium safety.",
    },
    {
      title: "Frequently Asked Questions",
      href: "/faqs",
      desc: "Answers to common security, account authentication, and pass retrieval questions.",
    },
    {
      title: "Contact Support Desk",
      href: "/contact",
      desc: "Get in touch directly with our support engineers and privacy specialists.",
    },
  ];

  return (
    <PolicyLayout
      badge="Data Protection & Privacy"
      badgeIcon={<ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
      title="Privacy Policy"
      subtitle="We prioritize your personal security. Discover how your data, payment records, and match pass details are guarded with advanced encryption standards."
      lastUpdated="September 30, 2026"
      highlights={highlights}
      sections={sections}
      relatedLinks={relatedLinks}
    />
  );
}
