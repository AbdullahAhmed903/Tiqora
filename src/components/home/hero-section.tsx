"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HERO_IMAGES = [
  {
    id: "hero-1",
    src: "/hero/hero-one.png",
    alt: "Events Bring People Closer",
  },
  {
    id: "hero-2",
    src: "/hero/heroTwo.png",
    alt: "Live Experiences For A Brighter Tomorrow",
  },
  {
    id: "hero-3",
    src: "/hero/herothree.png",
    alt: "Live Moments Last Longer",
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Auto-advance slides every 6 seconds unless user is hovering
  React.useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  return (
    <section
      className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl group transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Clickable Banner Image Container */}
      <Link
        href="/events"
        className="block relative w-full aspect-[2.35/1] min-h-[220px]"
      >
        {HERO_IMAGES.map((img, idx) => (
          <div
            key={img.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentIndex
                ? "opacity-100 z-10 scale-100"
                : "opacity-0 z-0 scale-[1.01] pointer-events-none"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={idx === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </Link>

      {/* Carousel Slide Switcher (< 01 / 03 >) */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-20 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous slide"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black/20 dark:border-white/20 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <span className="font-mono text-xs sm:text-sm font-bold text-white bg-black/60 backdrop-blur-md border border-black/20 dark:border-white/20 px-3 py-1.5 rounded-full shadow-lg">
          0{currentIndex + 1} / 0{HERO_IMAGES.length}
        </span>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next slide"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-black/20 dark:border-white/20 bg-black/60 hover:bg-black/80 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer shadow-lg active:scale-95"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </section>
  );
}
