import type { Metadata } from "next";
import { AuthSplitCard } from "@/components/auth/auth-split-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password | Tiqora - Events & Sports Ticketing",
  description:
    "Reset and update your password for your Tiqora account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthSplitCard type="reset-password">
      <ResetPasswordForm />
    </AuthSplitCard>
  );
}
