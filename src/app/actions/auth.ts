"use server";

import { createClient } from "@/lib/supabase/server";
import {
  signUpWithEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  adminLoginSchema,
} from "@/lib/validations/auth";
import { headers } from "next/headers";

export async function signUpAction(formData: {
  username: string;
  email: string;
  password: string;
}) {
  const parsed = signUpWithEmailSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid sign up details.";
    return { success: false, error: errorMsg };
  }

  const headerList = await headers();
  const origin = headerList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: parsed.data.username,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    requiresEmailConfirmation: !data.session,
  };
}

export async function loginAction(formData: {
  identifier: string;
  password: string;
}) {
  const parsed = loginSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid login credentials.";
    return { success: false, error: errorMsg };
  }

  const supabase = await createClient();
  let email = parsed.data.identifier;

  // If user entered a username instead of an email, attempt to look up email in profiles
  if (!email.includes("@")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", email)
      .maybeSingle();

    if (profile?.email) {
      email = profile.email;
    }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, redirectUrl: "/" };
}

export async function forgotPasswordAction(formData: { email: string }) {
  const parsed = forgotPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid email address.";
    return { success: false, error: errorMsg };
  }

  const headerList = await headers();
  const origin = headerList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function resetPasswordAction(formData: {
  password: string;
  confirmPassword: string;
}) {
  const parsed = resetPasswordSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid password configuration.";
    return { success: false, error: errorMsg };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function adminLoginAction(formData: {
  email: string;
  password: string;
}) {
  const parsed = adminLoginSchema.safeParse(formData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message || "Invalid credentials.";
    return { success: false, error: errorMsg };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { success: false, error: error?.message || "Authentication failed." };
  }

  // Strictly verify role from the 'profiles' database table
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  const userRole = profile?.role;

  if (profileError || (userRole !== "admin" && userRole !== "super_admin")) {
    // Immediately sign out non-admin user
    await supabase.auth.signOut();
    return {
      success: false,
      error: "Access denied. Only administrators can log in to the admin portal.",
    };
  }

  return { success: true, redirectUrl: "/admin" };
}
