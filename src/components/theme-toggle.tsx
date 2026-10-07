"use client";

import { useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const saved = localStorage.getItem("tiqora-theme");
  if (saved === "light" || saved === "dark") return saved;
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): "dark" | "light" {
  return "dark";
}

interface ThemeToggleProps {
  iconOnly?: boolean;
  className?: string;
}

export function ThemeToggle({ iconOnly = false, className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Sync html class on mount if there's a stored preference
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("tiqora-theme");
    if (saved === "light" && document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else if (saved === "dark" && !document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
  }

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem("tiqora-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
    window.dispatchEvent(new Event("storage"));
  };

  if (iconOnly) {
    return (
      <button
        onClick={toggleTheme}
        title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
        className={
          className ||
          "w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex items-center justify-center cursor-pointer"
        }
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4 text-zinc-300 hover:text-amber-400 transition-colors" />
        ) : (
          <Moon className="h-4 w-4 text-[#2563EB]" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} theme`}
      className={
        className ||
        "p-2 rounded-xl border border-border bg-surface text-foreground hover:opacity-80 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
      }
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-4 w-4 text-amber-400" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="h-4 w-4 text-[#2563EB]" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
