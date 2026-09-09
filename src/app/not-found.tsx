import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[60] bg-[#050814] text-slate-100 overflow-y-auto min-h-screen flex flex-col justify-between">
      {/* Background artwork from public/404-page.png */}
      <div className="absolute inset-0 select-none pointer-events-none z-0">
        <Image
          src="/404-page.png"
          alt="Tiqora 404 Page Not Found"
          fill
          priority
          className="object-cover object-center opacity-95"
        />
        {/* Subtle dark gradient scrim for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050814]/85 via-[#050814]/40 to-transparent pointer-events-none md:max-w-3xl" />
      </div>

      {/* Top Navigation Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 flex items-center justify-between">
        {/* Official Tiqora Brand Logo */}
        <Link href="/" className="inline-flex items-center gap-2.5 group flex-shrink-0">
          <div className="relative h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Tiqora Logo"
              width={36}
              height={36}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-black text-xl sm:text-2xl tracking-tight text-white group-hover:text-[#2563EB] transition-colors">
            Tiqora
          </span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16 my-auto flex flex-col justify-center">
        <div className="max-w-xl">
          {/* Badge: Page Not Found */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.06] border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-md shadow-sm">
            <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Page Not Found</span>
          </div>

          {/* Large Hero Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mt-6">
            Oops!
            <br />
            <span className="text-[#3B82F6] drop-shadow-[0_0_35px_rgba(59,130,246,0.6)]">
              404
            </span>{" "}
            Not Found
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-400 max-w-md leading-relaxed mt-4 font-normal">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Let&apos;s get you back on track.
          </p>

          {/* Action: Go to Home Button */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-blue-500/40 bg-blue-600/10 hover:bg-blue-600/25 hover:border-blue-500 text-sm font-semibold text-blue-400 hover:text-white transition-all shadow-sm cursor-pointer group"
            >
              <Home className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
              <span>Go to Home</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Script Callout: "Looks like you took a wrong turn..." positioned directly above the 404 stone */}
      <aside
        aria-hidden="true"
        className="hidden lg:flex flex-col items-center absolute right-[6vw] xl:right-[9vw] 2xl:right-[11vw] top-[20vh] xl:top-[22vh] select-none pointer-events-none -rotate-[13deg] z-20"
      >
        <div className="font-[family-name:var(--font-caveat)] text-2xl xl:text-3xl font-bold text-[#60A5FA] tracking-wide leading-tight text-center drop-shadow-[0_0_16px_rgba(96,165,250,0.55)]">
          Looks like
          <br />
          you took a wrong
          <br />
          turn...
        </div>
        {/* Hand-drawn curved arrow sweeping down and left towards 404 stone */}
        <svg
          className="w-9 h-12 text-[#60A5FA] -mt-1 ml-4 drop-shadow-[0_0_10px_rgba(96,165,250,0.6)]"
          viewBox="0 0 40 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M32 4C35 18 30 32 10 40"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M18 33L10 40L14 48"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </aside>

      {/* Footer copyright element */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pb-6 sm:pb-8 flex items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Tiqora. All rights reserved.</p>
        <p className="hidden sm:block">Need help? <Link href="/help" className="text-blue-400 hover:underline">Contact Support</Link></p>
      </footer>
    </div>
  );
}
