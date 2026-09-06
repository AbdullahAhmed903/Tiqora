import * as React from "react";
import { AuthHeroBanner } from "./hero-banner";
import { cn } from "@/lib/utils";

interface AuthSplitCardProps {
  type: "login" | "signup";
  children: React.ReactNode;
  className?: string;
}

export function AuthSplitCard({
  type,
  children,
  className,
}: AuthSplitCardProps) {
  return (
    <div
      className={cn(
        "w-full min-h-[calc(100vh-8rem)] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50/60 dark:bg-zinc-950 relative overflow-hidden selection:bg-[#2563EB]/20 selection:text-[#2563EB]",
        className
      )}
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Hero Content & Category Badges */}
        <div className="lg:col-span-6 xl:col-span-7">
          <AuthHeroBanner type={type} />
        </div>

        {/* Right Column: Floating Auth Card Container */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none rounded-3xl p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
