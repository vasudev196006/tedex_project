"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export interface LandingHeroProps {
  onContainerRefReady?: (ref: React.RefObject<HTMLDivElement | null>) => void;
  onLoadStateChange?: (isLoaded: boolean) => void;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onContainerRefReady,
  onLoadStateChange,
  scrollContainerRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const textInnerRef = useRef<HTMLDivElement>(null);
  const cutoutLayerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const [hasLoaded, setHasLoaded] = useState(false);

  // Notify parent of container ref ready
  useEffect(() => {
    if (onContainerRefReady && containerRef.current) {
      onContainerRefReady(containerRef);
    }
  }, [onContainerRefReady]);

  // Master GSAP animation sequence & interactive mouse parallax
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fast, responsive quickTo setters for interactive 3D parallax depth
    const bgX = gsap.quickTo(bgLayerRef.current, "x", { duration: 0.6, ease: "power2.out" });
    const bgY = gsap.quickTo(bgLayerRef.current, "y", { duration: 0.6, ease: "power2.out" });

    const textX = gsap.quickTo(textLayerRef.current, "x", { duration: 0.45, ease: "power2.out" });
    const textY = gsap.quickTo(textLayerRef.current, "y", { duration: 0.45, ease: "power2.out" });

    const cutoutX = gsap.quickTo(cutoutLayerRef.current, "x", { duration: 0.35, ease: "power2.out" });
    const cutoutY = gsap.quickTo(cutoutLayerRef.current, "y", { duration: 0.35, ease: "power2.out" });

    const glowX = gsap.quickTo(glowRef.current, "x", { duration: 0.55, ease: "power2.out" });
    const glowY = gsap.quickTo(glowRef.current, "y", { duration: 0.55, ease: "power2.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized coordinates from -1 to 1 centered
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;

      // Real 3D depth differential
      bgX(nx * -14);
      bgY(ny * -10);

      glowX(nx * 10);
      glowY(ny * 8);

      textX(nx * 16);
      textY(ny * 11);

      cutoutX(nx * 34);
      cutoutY(ny * 24);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // GSAP Context to cleanly manage tweens and timelines
    const ctx = gsap.context(() => {
      // Initial positioning:
      // Text starts 350px down, submerged safely behind the campus buildings in cutout.png
      gsap.set(textInnerRef.current, {
        y: 350,
        opacity: 0,
        scale: 0.94,
        force3D: true,
      });

      gsap.set(glowRef.current, {
        opacity: 0,
        scale: 0.7,
        force3D: true,
      });

      // Snappy, silky-smooth rise-up reveal timeline with expo.out easing
      const tl = gsap.timeline({
        delay: 0.08,
        onComplete: () => {
          setHasLoaded(true);
          onLoadStateChange?.(true);

          // Subtle organic float animation after rising up
          gsap.to(textInnerRef.current, {
            y: "-=8",
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Ambient pulse for the red atmospheric glow
          gsap.to(glowRef.current, {
            opacity: 0.75,
            scale: 1.15,
            duration: 3.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
      });

      // 1. Text fades in swiftly while rising
      tl.to(
        textInnerRef.current,
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        0
      )
      // 2. Text surges up 350px and glides all the way to the TOP with exponential deceleration
      .to(
        textInnerRef.current,
        {
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "expo.out",
        },
        0
      )
      // 3. Atmospheric crimson glow radiates behind the rising logo
      .to(
        glowRef.current,
        {
          opacity: 0.65,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
        },
        0.05
      );
    }, container);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, [onLoadStateChange]);

  // Optional subtle scroll depth effect
  useEffect(() => {
    const scrollEl = scrollContainerRef?.current;
    if (!scrollEl) return;

    let rafId: number;
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const st = scrollEl.scrollTop;
        if (st > window.innerHeight * 1.2) return;

        // Differential scroll depth
        if (textLayerRef.current) {
          gsap.set(textLayerRef.current, { y: st * 0.35 });
        }
        if (cutoutLayerRef.current) {
          gsap.set(cutoutLayerRef.current, { y: st * 0.12 });
        }
        if (bgLayerRef.current) {
          gsap.set(bgLayerRef.current, { y: st * 0.05 });
        }
      });
    };

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [scrollContainerRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-dvh min-h-[600px] overflow-hidden bg-[#050505] flex items-center justify-center select-none"
    >
      <h1 className="sr-only">TEDx VJCET - Ideas Worth Spreading</h1>

      {/* LAYER 1 (BOTTOM): Background Campus Scene (vjcet-main-1.png) */}
      <div
        ref={bgLayerRef}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-0"
      >
        <div className="relative w-full h-full scale-105 origin-center">
          <Image
            src="/vjcet-main-1.png"
            alt="VJCET campus twilight sky"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </div>
      </div>

      {/* LAYER 1.5: Ambient Crimson Atmospheric Glow (Behind text) */}
      <div
        ref={glowRef}
        className="absolute top-[16%] sm:top-[17%] md:top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] md:w-[800px] lg:w-[1000px] h-[200px] sm:h-[260px] md:h-[320px] rounded-full pointer-events-none z-5 will-change-transform opacity-0 blur-3xl bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.6)_0%,rgba(235,0,40,0.2)_45%,transparent_75%)]"
      />

      {/* LAYER 2 (MIDDLE): Rising SVG Text (tedx-vjcet.svg) positioned at the TOP */}
      <div
        ref={textLayerRef}
        className="absolute inset-x-0 top-0 w-full flex flex-col items-center pointer-events-none z-10 will-change-transform pt-10 sm:pt-12 md:pt-14 lg:pt-16 px-4"
      >
        <div
          ref={textInnerRef}
          className="relative w-[92%] sm:w-[84%] md:w-[72%] lg:w-[60%] max-w-[950px] flex flex-col items-center justify-center will-change-transform"
        >
          {/* Main TEDx VJCET SVG */}
          <div className="w-full relative filter drop-shadow-[0_12px_40px_rgba(0,0,0,0.9)] drop-shadow-[0_0_35px_rgba(235,0,40,0.55)]">
            <Image
              src="/tedx-vjcet.svg"
              alt="TEDx VJCET Logo"
              width={1758}
              height={440}
              priority
              className="w-full h-auto object-contain pointer-events-none select-none"
            />
          </div>
        </div>
      </div>

      {/* LAYER 3 (TOPMOST): Campus Architecture Foreground Cutout (cutout.png) - Enlarged by 10% from bottom to cover background buildings */}
      <div
        ref={cutoutLayerRef}
        className="absolute inset-0 w-full h-full pointer-events-none will-change-transform z-20"
      >
        <div className="relative w-full h-full scale-[1.10] origin-bottom">
          <Image
            src="/cutout.png"
            alt="VJCET campus foreground silhouette"
            fill
            priority
            sizes="100vw"
            className="w-full h-full object-cover object-center pointer-events-none select-none"
          />
        </div>
      </div>

      {/* Atmospheric depth lighting: Soft bottom blend to transition smoothly into #050505 */}
      <div className="absolute inset-x-0 bottom-0 h-32 sm:h-44 md:h-56 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent pointer-events-none z-25" />

      {/* Subtle top vignette for dramatic cinematic presence */}
      <div className="absolute inset-x-0 top-0 h-28 md:h-40 bg-gradient-to-b from-black/70 via-black/20 to-transparent pointer-events-none z-25" />
    </div>
  );
};

export default LandingHero;
