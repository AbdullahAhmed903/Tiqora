import { Metadata } from "next";
import { ContactView } from "@/components/contact/contact-view";

export const metadata: Metadata = {
  title: "Contact Us | Tiqora Support & Helpdesk",
  description:
    "Get in touch with the Tiqora customer care team. Fast assistance with match tickets, digital QR passes, stadium turnstile entry, refunds, and tournament hosting.",
  keywords: [
    "Tiqora contact us",
    "sports tickets customer support",
    "match ticket helpdesk",
    "stadium gate support",
    "digital ticket QR issue",
    "ticket refund request",
    "cairo stadium assistance",
  ],
};

export default function ContactPage() {
  return (
    <main className="min-h-screen pb-20 bg-[#080B12]">
      <ContactView />
    </main>
  );
}
