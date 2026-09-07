"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GoogleButton } from "./google-button";
import { PasswordInput } from "./password-input";
import { TrustBadges } from "./trust-badges";
import { Button } from "@/components/ui/button";
import { loginAction } from "@/app/actions/auth";

export function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;

    setIsLoading(true);
    try {
      const res = await loginAction({ identifier, password });
      if (res.success) {
        toast.success("Successfully signed in!");
        router.push(res.redirectUrl || "/");
        router.refresh();
      } else {
        toast.error(res.error || "Invalid credentials. Please try again.");
      }
    } catch {
      toast.error("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full text-zinc-900 dark:text-white">
      {/* Header Titles */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Sign in to continue to Tiqora
        </p>
      </div>

      {/* Social Google Login */}
      <GoogleButton label="Continue with Google" />

      {/* Divider */}
      <div className="relative flex items-center justify-center my-1">
        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
        <span className="absolute bg-white dark:bg-zinc-900 px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 select-none">
          OR
        </span>
      </div>

      {/* Form Inputs */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email or Username */}
        <div className="space-y-1.5">
          <label
            htmlFor="identifier"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Email or Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or username"
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
            placeholder="Enter your password"
            required
          />
          <div className="flex justify-end pt-0.5">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>
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
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>

        {/* Don't have an account switch link under Sign in button */}
        <p className="text-center text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 pt-1">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors"
          >
            Sign up
          </Link>
        </p>
      </form>

      {/* Footer Trust Features inside card */}
      <TrustBadges type="login" className="pt-2" />
    </div>
  );
}
