import { Metadata } from "next";
import { TermsView } from "@/components/legal/terms-view";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service | Tiqora Sports & Event Ticketing",
  description:
    "Review the official Terms of Service for Tiqora. Learn about ticket booking conditions, digital QR pass usage, stadium admission rules, refund rights, and buyer obligations.",
  keywords: [
    "Tiqora Terms of Service",
    "ticket purchase terms",
    "stadium entry conditions",
    "football match tickets agreement",
    "QR pass usage rules",
    "sports event booking terms",
  ],
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen pb-20 bg-background">
      <TermsView />
    </div>
  );
}
