"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface CombinedLoadingHeroProps {
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  onLoadStateChange?: (isLoaded: boolean) => void;
  onContainerRefReady?: (ref: React.RefObject<HTMLDivElement | null>) => void;
}

export const CombinedLoadingHero = ({
  onLoadStateChange,
  onContainerRefReady,
}: CombinedLoadingHeroProps) => {
  const [parallaxTransform, setParallaxTransform] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onContainerRefReady?.(containerRef);
    onLoadStateChange?.(true);
  }, [onContainerRefReady, onLoadStateChange]);

  // Interactive mouse parallax effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (typeof window === "undefined") return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate normalized mouse position (-1 to 1)
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;

    // Parallax intensity
    const parallaxIntensity = 15;
    setParallaxTransform({
      x: x * parallaxIntensity,
      y: y * parallaxIntensity,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh overflow-hidden bg-[#050505] flex items-center justify-center select-none"
    >
      {/* Hidden h1 for accessibility */}
      <h1 className="sr-only">TEDx VJCET - Ideas Worth Spreading</h1>

      {/* Layer 1: Campus Scene Background */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${parallaxTransform.x}px, ${parallaxTransform.y}px) scale(1.05)`,
        }}
      >
        <Image
          src="/vjcet-main.png"
          alt="Hero Background"
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      </div>

      {/* Layer 2: TEDx VJCET Event Artwork (Middle layer behind campus cutout with fade-up) */}
      <div
        className="absolute inset-0 w-full h-full z-1 pointer-events-none flex items-center justify-center transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${parallaxTransform.x * 0.7}px, ${parallaxTransform.y * 0.7}px) scale(1.05)`,
        }}
      >
        <div className="relative aspect-[1672/941] w-full h-full max-w-full max-h-full">
          <div className="absolute left-[2.74%] top-[13.82%] h-[86.18%] w-[97.26%] animate-fade-up">
            <Image
              src="/tedextxt-transparent.png"
              alt="TEDx VJCET event artwork"
              fill
              priority
              sizes="100vw"
              className="object-contain object-center pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Layer 3: Campus Buildings Cutout (Foreground layer in front of artwork) */}
      <div
        className="absolute inset-0 w-full h-full z-2 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${parallaxTransform.x}px, ${parallaxTransform.y}px) scale(1.05)`,
        }}
      >
        <Image
          src="/cutout.png"
          alt="VJCET campus at sunset"
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center pointer-events-none"
        />
      </div>

      {/* Mobile gradient overlay - top-left to bottom-right */}
      <div className="absolute inset-0 z-3 md:hidden bg-linear-to-br from-black/70 via-black/20 to-transparent pointer-events-none" />
    </div>
  );
};
