import type { Metadata } from "next";
import { AuthSplitCard } from "@/components/auth/auth-split-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot Password | Tiqora - Events & Sports Ticketing",
  description:
    "Request a password reset link for your Tiqora account.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthSplitCard type="forgot-password">
      <ForgotPasswordForm />
    </AuthSplitCard>
  );
}
