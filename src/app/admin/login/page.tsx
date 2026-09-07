import type { Metadata } from "next";
import { AuthSplitCard } from "@/components/auth/auth-split-card";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | Tiqora",
  description: "Secure login for Tiqora administrators.",
};

export default function AdminLoginPage() {
  return (
    <AuthSplitCard type="admin-login">
      <AdminLoginForm />
    </AuthSplitCard>
  );
}
