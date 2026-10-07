import { Metadata } from "next";
import { TicketPolicyView } from "@/components/legal/ticket-policy-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Ticket & Admission Policy | Tiqora Sports Ticketing",
  description:
    "Official Tiqora Ticket Policy: verified dynamic QR passes, stadium turnstile entry guidelines, cancellations, refunds, transfers, and fan code of conduct.",
  keywords: [
    "Tiqora Ticket Policy",
    "stadium gate admission",
    "digital ticket QR pass",
    "match ticket refunds",
    "transfer football tickets",
    "stadium rules and prohibited items",
  ],
};

export default function TicketPolicyPage() {
  return (
    <div className="min-h-screen pb-20 bg-background">
      <TicketPolicyView />
    </div>
  );
}
