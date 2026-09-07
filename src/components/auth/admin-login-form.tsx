"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PasswordInput } from "./password-input";
import { Button } from "@/components/ui/button";
import { adminLoginAction } from "@/app/actions/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const res = await adminLoginAction({ email, password });
      if (res.success) {
        toast.success("Welcome, Administrator!");
        router.push(res.redirectUrl || "/admin");
        router.refresh();
      } else {
        toast.error(res.error || "Invalid admin credentials.");
      }
    } catch (err) {
      toast.error("An unexpected authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 w-full text-zinc-900 dark:text-white">
      {/* Admin Badge Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-[#2563EB]">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            ADMINISTRATOR PORTAL
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Admin Access
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Sign in with your administrative credentials to manage Tiqora platform.
        </p>
      </div>

      {/* Form Inputs - Email & Password ONLY (No Google Login) */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="admin-email"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Admin Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tiqora.com"
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-2.5 pl-10 pr-3.5 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all duration-150 shadow-2xs focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="admin-password"
            className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300"
          >
            Password
          </label>
          <PasswordInput
            id="admin-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your admin password"
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
              Authenticating...
            </span>
          ) : (
            "Sign in as Admin"
          )}
        </Button>

        {/* Security Notice Footer */}
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Protected area. Unauthorized access attempts are logged and monitored.
          </p>
          <Link
            href="/login"
            className="inline-block mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-[#2563EB] transition-colors"
          >
            Standard User Sign In →
          </Link>
        </div>
      </form>
    </div>
  );
}
