"use client";

import React from "react";
import Image from "next/image";

export const TedxVjcet = (): JSX.Element => {
  return (
    <main
      aria-label="TEDx VJCET"
      className="relative w-full h-dvh min-h-[600px] overflow-hidden bg-[#050505] flex items-center justify-center"
    >
      {/* Layer 1: Background Campus Scene */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/vjcet-main.png"
          alt="VJCET campus background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center pointer-events-none"
        />
      </div>

      {/* Layer 2: TEDx VJCET Event Artwork (Middle layer with fade-up animation behind the cutout) */}
      <div className="absolute inset-0 flex items-center justify-center z-1 pointer-events-none">
        <div className="relative w-full h-full max-w-[1672px] max-h-[941px]">
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

      {/* Layer 3: Campus Buildings Cutout (Foreground Layer in front of Artwork) */}
      <div className="absolute inset-0 w-full h-full z-2 pointer-events-none">
        <Image
          src="/cutout.png"
          alt="VJCET campus at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </main>
  );
};
