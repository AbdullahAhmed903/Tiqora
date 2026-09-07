"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, User, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { GoogleButton } from "./google-button";
import { PasswordInput } from "./password-input";
import { TrustBadges } from "./trust-badges";
import { Button } from "@/components/ui/button";
import { signUpAction } from "@/app/actions/auth";

export function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [emailConfirmationRequired, setEmailConfirmationRequired] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await signUpAction({ username, email, password });
      if (res.success) {
        if (res.requiresEmailConfirmation) {
          setEmailConfirmationRequired(true);
          toast.success("Account created! Please check your email to verify.");
        } else {
          toast.success("Account created successfully!");
          router.push("/");
          router.refresh();
        }
      } else {
        toast.error(res.error || "Failed to create account.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during sign up.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailConfirmationRequired) {
    return (
      <div className="flex flex-col space-y-6 w-full text-zinc-900 dark:text-white py-2">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#2563EB] shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            Verify your email
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            We sent a verification link to <span className="font-semibold text-zinc-900 dark:text-white">{email}</span>. Click the link in the email to activate your account.
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
    <div className="flex flex-col space-y-5 w-full text-zinc-900 dark:text-white">
      {/* Header Titles */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Create an account
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Join Tiqora and never miss an event
        </p>
      </div>

      {/* Social Google Registration */}
      <GoogleButton label="Continue with Google" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none">
          OR
        </span>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Username */}
        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <User className="h-4 w-4" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all duration-150 shadow-2xs focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all duration-150 shadow-2xs focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 characters"
            required
          />
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-xl shadow-xs transition-all mt-2 cursor-pointer disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating account...
            </span>
          ) : (
            "Sign up"
          )}
        </Button>

        {/* Already have an account switch link under Sign up button */}
        <p className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pt-1">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors"
          >
            Sign in
          </Link>
        </p>

        {/* Terms & Privacy Note */}
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 text-center leading-relaxed pt-1">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="font-medium text-[#2563EB] hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-medium text-[#2563EB] hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>

      {/* Footer Trust Features inside card */}
      <TrustBadges type="signup" className="pt-2" />
    </div>
  );
}
