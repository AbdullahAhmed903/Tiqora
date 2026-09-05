import Image from "next/image";
import { CheckCircle2, Terminal, Palette } from "lucide-react";
import { ToastTestButton } from "@/components/toast-test-button";

export default function HomePage() {
  const stackItems = [
    { name: "Next.js 16 (App Router)", desc: "React Server Components (RSC)" },
    { name: "TypeScript", desc: "Strict end-to-end type safety" },
    { name: "Supabase (DB & Auth)", desc: "Publishable & Secret Keys supported" },
    { name: "Tailwind CSS v4", desc: "Configured with custom Light & Dark palettes" },
    { name: "Zod", desc: "Data & schema validation" },
    { name: "Sonner", desc: "Interactive toast notifications" },
    { name: "Resend", desc: "Transactional email delivery" },
    { name: "Stripe", desc: "Payment gateway integration" },
    { name: "Lucide React", desc: "Modern unified icon set" },
    { name: "Vercel", desc: "Edge-ready deployment setup" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-16">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl w-full text-center space-y-8">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative h-28 w-28 rounded-3xl p-1 bg-gradient-to-b from-[#2563EB] to-blue-400 shadow-2xl shadow-[#2563EB]/20">
            <div className="h-full w-full bg-background rounded-[22px] flex items-center justify-center overflow-hidden p-2">
              <Image
                src="/logo.png"
                alt="Tiqora Logo"
                width={100}
                height={100}
                className="object-contain"
                priority
              />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              Tiqora
            </h1>
            <p className="text-sm sm:text-base text-secondary-text max-w-lg mx-auto">
              Event, football match, and sports ticketing platform.
            </p>
          </div>
        </div>

        {/* Action Button to Test Sonner */}
        <div className="flex justify-center pt-2">
          <ToastTestButton />
        </div>

        {/* Active Theme Preview Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 text-left shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#2563EB]" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Color System (Light & Dark)
              </h3>
            </div>
            <span className="text-[11px] text-secondary-text">
              Toggle theme in the navbar
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-border bg-background">
              <div className="text-[10px] text-secondary-text uppercase font-semibold">Background</div>
              <div className="font-mono text-xs font-bold text-foreground mt-1">var(--background)</div>
            </div>
            <div className="p-3 rounded-xl border border-border bg-surface">
              <div className="text-[10px] text-secondary-text uppercase font-semibold">Cards / Surface</div>
              <div className="font-mono text-xs font-bold text-foreground mt-1">var(--surface)</div>
            </div>
            <div className="p-3 rounded-xl border border-border bg-[#2563EB] text-white">
              <div className="text-[10px] text-blue-100 uppercase font-semibold">Primary Button</div>
              <div className="font-mono text-xs font-bold mt-1">#2563EB</div>
            </div>
            <div className="p-3 rounded-xl border border-border bg-background">
              <div className="text-[10px] text-secondary-text uppercase font-semibold">Borders</div>
              <div className="font-mono text-xs font-bold text-foreground mt-1">var(--border)</div>
            </div>
          </div>
        </div>

        {/* Initialized Stack Grid */}
        <div className="bg-surface border border-border rounded-2xl p-6 text-left shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <Terminal className="h-4 w-4 text-[#2563EB]" />
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Installed & Configured Stack
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stackItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-background border border-border"
              >
                <CheckCircle2 className="h-4 w-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-foreground">{item.name}</div>
                  <div className="text-[11px] text-secondary-text">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
