"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AuthVisualBannerProps {
  type: "login" | "signup";
  className?: string;
}

const SIGNUP_IMAGES = [
  {
    src: "/sigupAndLogin/signup-hero.png",
    alt: "Tiqora - Your Next Experience Awaits",
  },
  {
    src: "/sigupAndLogin/login-hero.png",
    alt: "Tiqora - More Than Events. Real Experiences.",
  },
  {
    src: "/sigupAndLogin/signup-portal.png",
    alt: "Tiqora - Different Events. A Brighter You.",
  },
];

export function AuthVisualBanner({ type, className }: AuthVisualBannerProps) {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-change images in signup every 4 seconds
  React.useEffect(() => {
    if (type !== "signup" || isPaused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SIGNUP_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [type, isPaused]);

  if (type === "login") {
    return (
      <div
        className={cn(
          "relative w-full h-full min-h-screen bg-[#070b14] overflow-hidden select-none",
          className
        )}
      >
        {/* Full-bleed edge-to-edge image filling the entire left 50% */}
        <Image
          src="/sigupAndLogin/login-hero.png"
          alt="Tiqora - More Than Events. Real Experiences."
          fill
          priority
          sizes="50vw"
          className="object-cover object-top"
        />
      </div>
    );
  }

  // SIGNUP BANNER (Full-bleed auto-changing images filling the entire left 50%)
  return (
    <div
      className={cn(
        "relative w-full h-full min-h-screen bg-[#070b14] overflow-hidden select-none",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Auto-changing slides crossfading edge-to-edge */}
      {SIGNUP_IMAGES.map((image, idx) => (
        <div
          key={image.src}
          className={cn(
            "absolute inset-0 transition-all duration-700 ease-in-out",
            activeSlide === idx
              ? "opacity-100 z-10 visible scale-100"
              : "opacity-0 z-0 invisible pointer-events-none scale-[1.02]"
          )}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority={idx === 0}
            sizes="50vw"
            className="object-cover object-top"
          />
        </div>
      ))}

      {/* Floating glass pagination dots at the bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-2 shadow-lg">
        {SIGNUP_IMAGES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveSlide(idx)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
              activeSlide === idx
                ? "w-6 bg-[#2563EB] shadow-xs shadow-blue-500/50"
                : "w-2 bg-white/40 hover:bg-white/80"
            )}
            aria-label={`Switch to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
