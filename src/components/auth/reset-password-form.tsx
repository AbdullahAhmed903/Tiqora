"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { PasswordInput } from "./password-input";
import { Button } from "@/components/ui/button";
import { resetPasswordAction } from "@/app/actions/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    if (code) {
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          toast.error(error.message || "Invalid or expired password reset link.");
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPasswordAction({ password, confirmPassword });
      if (res.success) {
        setIsSuccess(true);
        toast.success("Password updated successfully!");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(res.error || "Failed to reset password.");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col space-y-6 w-full text-zinc-900 dark:text-white py-2">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Password Reset Complete
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Your password has been successfully updated. Redirecting to sign in...
          </p>
        </div>

        <div className="pt-2">
          <Link href="/login">
            <Button
              type="button"
              className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Proceed to Sign in
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full text-zinc-900 dark:text-white">
      {/* Header Titles */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Reset password
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Enter your new password below to regain access to your account.
        </p>
      </div>

      {/* Form Inputs - Password and Repeat Password only */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            New Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            required
          />
        </div>

        {/* Repeat Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Repeat Password
          </label>
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        {/* Password match indicator message */}
        {confirmPassword.length > 0 && (
          <p className={`text-xs font-medium ${password === confirmPassword ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
            {password === confirmPassword ? "✓ Passwords match" : "✕ Passwords do not match"}
          </p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-xl shadow-xs transition-all mt-2 cursor-pointer disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Updating password...
            </span>
          ) : (
            "Reset password"
          )}
        </Button>

        {/* Back to Login */}
        <div className="flex justify-center pt-1">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-[#2563EB] dark:hover:text-[#2563EB] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
