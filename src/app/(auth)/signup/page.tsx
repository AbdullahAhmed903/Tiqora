import type { Metadata } from "next";
import { AuthSplitCard } from "@/components/auth/auth-split-card";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Create an Account | Tiqora - Events & Sports Ticketing",
  description:
    "Join Tiqora to book football matches, concerts, live sports, and unforgettable events.",
};

export default function SignupPage() {
  return (
    <AuthSplitCard type="signup">
      <SignupForm />
    </AuthSplitCard>
  );
}
