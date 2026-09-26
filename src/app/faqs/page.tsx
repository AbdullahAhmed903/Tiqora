import { Metadata } from "next";
import { FaqsView } from "@/components/faqs/faqs-view";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQs) | Tiqora",
  description:
    "Find answers to common questions about buying match tickets, digital QR passes, stadium gate access, refunds, and hosting sports events on Tiqora.",
  keywords: [
    "Tiqora FAQs",
    "sports tickets questions",
    "digital ticket QR pass",
    "stadium entry guidelines",
    "ticket refund policy",
    "match day gates",
    "Cairo Derby tickets",
  ],
};

export default function FaqsPage() {
  return (
    <main className="min-h-screen pb-20 bg-[#080B12]">
      <FaqsView />
    </main>
  );
}
