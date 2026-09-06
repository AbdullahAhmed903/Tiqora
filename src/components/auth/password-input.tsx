"use client";

import * as React from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: boolean;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(({ className, leftIcon = true, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative w-full">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <Lock className="h-4 w-4" />
        </div>
      )}
      <input
        ref={ref}
        type={showPassword ? "text" : "password"}
        className={cn(
          "w-full rounded-xl border border-zinc-200 bg-white py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400",
          "transition-all duration-150 shadow-2xs",
          "focus:border-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/15",
          leftIcon ? "pl-10" : "pl-3.5",
          "pr-10",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
