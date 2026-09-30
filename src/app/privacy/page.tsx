import { Metadata } from "next";
import { PrivacyView } from "@/components/legal/privacy-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy | Tiqora Data Protection & Security",
  description:
    "Learn how Tiqora collects, safeguards, and utilizes your personal information, match booking records, and digital pass data in compliance with modern privacy standards.",
  keywords: [
    "Tiqora Privacy Policy",
    "data protection",
    "sports ticketing privacy",
    "GDPR compliance",
    "secure ticket transactions",
    "user data rights",
  ],
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pb-20 bg-[#080B12]">
      <PrivacyView />
    </main>
  );
}
