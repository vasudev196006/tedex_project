"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import group1 from "./group-1.png";
import vjcetMain2 from "./vjcet-main-2.png";

export interface TedxVjcetProps {
  onContainerRefReady?: (ref: React.RefObject<HTMLDivElement | null>) => void;
  onLoadStateChange?: (isLoaded: boolean) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const TedxVjcet = ({
  onContainerRefReady,
  onLoadStateChange,
}: TedxVjcetProps = {}): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    onContainerRefReady?.(containerRef);
    onLoadStateChange?.(true);
  }, [onContainerRefReady, onLoadStateChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (typeof window === "undefined") return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth) * 2 - 1;
    const y = (clientY / innerHeight) * 2 - 1;
    setParallax({ x: x * 15, y: y * 15 });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh min-h-[600px] overflow-hidden bg-[#050505] flex items-center justify-center select-none"
    >
      <main
        aria-label="TEDx VJCET"
        className="relative w-full h-full aspect-[1672/941] max-w-[1672px] max-h-[941px] overflow-hidden bg-[url(/vjcet-main-1.png)] bg-cover bg-[50%_50%]"
        style={{
          transform: `translate(${parallax.x}px, ${parallax.y}px) scale(1.04)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Layer 2: TEDx VJCET event artwork with animate-fade-up */}
        <div
          className="absolute left-[2.74%] top-[13.82%] h-[86.18%] w-[97.26%] animate-fade-up pointer-events-none z-1"
          style={{
            transform: `translate(${parallax.x * -0.35}px, ${parallax.y * -0.35}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Image
            src={group1}
            alt="TEDx VJCET event artwork"
            fill
            priority
            sizes="100vw"
            className="object-contain object-center"
          />
        </div>

        {/* Layer 3: Campus foreground cutout in front of the artwork */}
        <div className="absolute left-0 top-0 w-full h-full aspect-[1.78] pointer-events-none z-2">
          <Image
            src={vjcetMain2}
            alt="VJCET campus at sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </main>
    </div>
  );
};
