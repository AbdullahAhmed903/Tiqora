"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      theme="dark"
      toastOptions={{
        style: {
          background: "#0f172a",
          border: "1px solid rgba(51, 65, 85, 0.7)",
          color: "#f8fafc",
          borderRadius: "0.75rem",
        },
      }}
    />
  );
}
