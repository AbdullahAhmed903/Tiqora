import type { Metadata } from "next";
import { AuthSplitCard } from "@/components/auth/auth-split-card";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Tiqora - Events & Sports Ticketing",
  description:
    "Sign in to your Tiqora account to access your tickets, manage sports bookings, and discover live experiences.",
};

export default function LoginPage() {
  return (
    <AuthSplitCard type="login">
      <LoginForm />
    </AuthSplitCard>
  );
}
