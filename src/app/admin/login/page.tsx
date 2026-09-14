import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthSplitCard } from "@/components/auth/auth-split-card";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Portal Sign In | Tiqora",
  description: "Secure login for Tiqora administrators.",
};

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // 1. Fast path: If already admin via JWT claims -> redirect to admin dashboard
    if (user.app_metadata?.role === "admin") {
      redirect("/admin");
    }

    // 2. Fallback: Check profile table in case JWT token hasn't refreshed yet
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      redirect("/admin");
    }

    // 3. Authenticated as regular non-admin user -> redirect to home page
    redirect("/");
  }

  return (
    <AuthSplitCard type="admin-login">
      <AdminLoginForm />
    </AuthSplitCard>
  );
}
