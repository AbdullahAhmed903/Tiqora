"use client";

import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ToastTestButton() {
  return (
    <Button
      onClick={() =>
        toast.success("Tiqora initialized successfully!", {
          description: "Next.js 16, Supabase, Stripe, Zod, Resend, Sonner & Tailwind CSS are configured.",
        })
      }
      className="font-bold text-white gap-2"
    >
      <Sparkles className="h-4 w-4" />
      Test Sonner Notification
    </Button>
  );
}
