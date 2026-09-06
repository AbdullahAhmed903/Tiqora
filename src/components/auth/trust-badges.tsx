import * as React from "react";
import { ShieldCheck, Zap, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgesProps {
  type: "login" | "signup";
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  const badges = [
    {
      icon: ShieldCheck,
      title: "Secure & private",
      description: "Your data is safe",
    },
    {
      icon: Zap,
      title: "Fast & easy",
      description: "Access in seconds",
    },
    {
      icon: Ticket,
      title: "All in one place",
      description: "Events, tickets, more",
    },
  ];

  return (
    <div
      className={cn(
        "grid grid-cols-3 gap-1 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto",
        className
      )}
    >
      {badges.map((badge, idx) => {
        const IconComponent = badge.icon;
        const isLast = idx === badges.length - 1;
        return (
          <div
            key={idx}
            className={cn(
              "flex flex-col items-center text-center px-1 group",
              !isLast && "border-r border-zinc-100 dark:border-zinc-800/80"
            )}
          >
            <div className="w-7 h-7 rounded-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 flex items-center justify-center text-zinc-600 dark:text-zinc-300 mb-1 group-hover:text-[#2563EB] group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/40 group-hover:border-blue-100 dark:group-hover:border-blue-900/50 transition-colors">
              <IconComponent className="w-3.5 h-3.5 stroke-[2]" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 leading-tight">
              {badge.title}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5">
              {badge.description}
            </span>
          </div>
        );
      })}
    </div>
  );
}
