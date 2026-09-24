"use client";

import { Toaster as SonnerToaster } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      theme="dark"
      closeButton
      icons={{
        error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
        success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
        info: <Info className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-[#3B82F6] animate-spin flex-shrink-0" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group font-sans text-xs sm:text-sm rounded-2xl backdrop-blur-2xl border py-3.5 pl-4 pr-10 transition-all select-none",
          error:
            "sonner-toast-error !bg-gradient-to-r !from-[#2e070e] !via-[#1c0409] !to-[#0d0205] !text-red-100 !border-red-500/40 !border-l-[6px] !border-l-red-500 !shadow-none",
          success:
            "sonner-toast-success !bg-gradient-to-r !from-[#041d14] !via-[#03130d] !to-[#020b08] !text-emerald-100 !border-emerald-500/40 !border-l-[6px] !border-l-emerald-500 !shadow-none",
          warning:
            "sonner-toast-warning !bg-gradient-to-r !from-[#281602] !via-[#170c01] !to-[#0c0601] !text-amber-100 !border-amber-500/40 !border-l-[6px] !border-l-amber-500 !shadow-none",
          info:
            "sonner-toast-info !bg-gradient-to-r !from-[#08152e] !via-[#040c1b] !to-[#02060e] !text-blue-100 !border-blue-500/40 !border-l-[6px] !border-l-blue-500 !shadow-none",
          title: "!font-bold !text-white",
          description: "!text-zinc-300 !text-xs",
          actionButton:
            "!bg-[#2563EB] hover:!bg-[#1D4ED8] !text-white !font-bold !rounded-xl !text-xs",
          cancelButton:
            "!bg-zinc-800 hover:!bg-zinc-700 !text-zinc-300 !rounded-xl !text-xs",
          closeButton:
            "!opacity-100 !visible !bg-white/10 !border-white/20 !text-white hover:!bg-red-500 hover:!text-white hover:!border-red-500 !rounded-md",
        },
      }}
    />
  );
}
