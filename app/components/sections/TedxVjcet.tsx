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
      >
        {/* Layer 2: Parallax Wrapper (Separated from keyframe animation transform) */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none z-1 flex items-center justify-center"
          style={{
            transform: `translate(${parallax.x * -0.35}px, ${parallax.y * -0.35}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          {/* Animated Artwork Layer: left-[2.74%] top-[13.82%] h-[86.18%] w-[97.26%] */}
          <div className="absolute left-[2.74%] top-[13.82%] h-[86.18%] w-[97.26%] animate-fade-up">
            <Image
              src={group1}
              alt="TEDx VJCET event artwork"
              fill
              priority
              sizes="100vw"
              className="object-contain object-center animate-image-glow"
            />
          </div>
        </div>

        {/* Layer 3: Campus foreground cutout in front of the artwork */}
        <div
          className="absolute left-0 top-0 w-full h-full aspect-[1.78] pointer-events-none z-2"
          style={{
            transform: `translate(${parallax.x * 0.15}px, ${parallax.y * 0.15}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
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

      {/* Scoped CSS animations for guaranteed rendering across all browsers */}
      <style jsx global>{`
        @keyframes fade-up {
          0% {
            opacity: 0;
            transform: translateY(90px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes image-glow {
          0% {
            opacity: 0.85;
            filter: drop-shadow(0 0 10px rgba(230, 43, 30, 0.4));
          }
          50% {
            opacity: 1;
            filter: drop-shadow(0 0 35px rgba(230, 43, 30, 0.85)) drop-shadow(0 0 60px rgba(230, 43, 30, 0.5));
          }
          100% {
            opacity: 0.9;
            filter: drop-shadow(0 0 15px rgba(230, 43, 30, 0.45));
          }
        }

        .animate-fade-up {
          animation: fade-up 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards !important;
          will-change: transform, opacity;
        }

        .animate-image-glow {
          animation: image-glow 3s ease-in-out infinite alternate !important;
          will-change: filter, opacity;
        }
      `}</style>
    </div>
  );
};
