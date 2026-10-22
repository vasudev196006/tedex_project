'use client';

import React from 'react';
import FlexCarousel, { FlexCarouselItem } from '@/app/components/ui/FlexCarousel';
import { Speaker } from '@/app/types';

interface FocusedSpeakersGridProps {
  speakers: Speaker[];
}

export const FocusedSpeakersGrid = ({ speakers }: FocusedSpeakersGridProps) => {
  const items: FlexCarouselItem[] = speakers.map(speaker => {
    const isPlaceholder = speaker.name === `SPEAKER ${speaker.id}` && speaker.role === 'TO BE REVEALED';
    return {
      src: isPlaceholder ? `/${speaker.gender || 'male'}_card.png` : `/cards1/${speaker.id}.png`,
      alt: isPlaceholder ? `Speaker ${speaker.id} - Revealing Soon` : speaker.name,
      title: isPlaceholder ? `SPEAKER #${speaker.id}` : speaker.name,
      subtitle: isPlaceholder ? 'REVEALING SOON' : speaker.role
    };
  });

  return (
    <div className="relative w-full h-[520px] sm:h-[580px] md:h-[640px] select-none">
      <FlexCarousel
        items={items}
        preset="liquid"
        intro="rise"
        fit="natural"
        cardHeight={0.62}
        gap={16}
        radius={16}
        squeeze={0.2}
        focusOnClick={true}
        captions={true}
        captureWheel={true}
        autoplay={false}
      />
    </div>
  );
};
