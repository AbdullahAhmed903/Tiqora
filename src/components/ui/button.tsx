import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, disabled, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    const variantStyles = {
      primary:
        "bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] dark:hover:bg-[#3B82F6] focus:ring-[#2563EB] shadow-md active:scale-[0.98]",
      secondary:
        "bg-surface text-foreground hover:opacity-90 border border-border active:scale-[0.98]",
      outline:
        "border border-border bg-transparent text-foreground hover:bg-surface active:scale-[0.98]",
      ghost:
        "bg-transparent text-secondary-text hover:bg-surface hover:text-foreground",
      danger:
        "bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-400 shadow-md active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
