'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  searchPlaceholder?: string;
  images?: string[];
  onSearch?: (value: string) => void;
}

const defaultImages = [
  '/assets/Background.png',
  '/assets/Background.png',
  '/assets/Background.png',
];

export default function HeroSection({
  searchPlaceholder = 'Makna V4',
  images = defaultImages,
  onSearch,
}: HeroSectionProps) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      // focus the input after opening
      if (!prev) {
        // queue to next tick so width transition doesn't block focus
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      return next;
    });
  };

  return (
    <div className='relative'>
      <div className='relative aspect-[16/9] overflow-hidden'>
        <Carousel
          plugins={[plugin.current]}
          className='w-full'
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            align: 'start',
            loop: true,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className='relative aspect-[16/9] w-full overflow-hidden'>
                  <Image
                    src={image}
                    alt={`Hero Background ${index + 1}`}
                    fill
                    sizes='(max-width: 720px) 100vw, 720px'
                    className='object-cover'
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className='absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none' />

        <div className='absolute inset-0 flex flex-col justify-start items-center text-center pt-4 sm:pt-5 px-4'>
          <div className='flex items-center gap-0 w-full'>
            <div className='relative flex items-center w-full justify-start'>
              <Button
                size='icon'
                aria-label='Search'
                aria-expanded={isSearchOpen}
                className={cn(
                  'bg-white/50 hover:bg-white/60 text-brand backdrop-blur-sm h-7 w-10 sm:h-9 sm:w-12 border border-gray-200',
                  isSearchOpen
                    ? 'rounded-l-lg rounded-r-none border-r-0'
                    : 'rounded-lg',
                )}
                onClick={toggleSearch}
              >
                <Search className='w-4 h-4 sm:w-5 sm:h-5' />
              </Button>
              <div
                className={cn(
                  'relative overflow-hidden min-w-0 transition-all duration-300 ease-in-out',
                  isSearchOpen
                    ? 'w-[calc(100%-40px)] sm:w-[calc(100%-48px)]'
                    : 'w-0',
                )}
              >
                <Input
                  ref={searchInputRef}
                  placeholder={searchPlaceholder}
                  className={cn(
                    'pl-4 pr-0 bg-white/50 backdrop-blur-sm border-gray-200 h-10 sm:h-12 border-l-0',
                    isSearchOpen
                      ? 'rounded-l-none rounded-r-lg opacity-100'
                      : 'rounded-l-none rounded-r-lg opacity-0 pointer-events-none',
                  )}
                  onChange={(e) => onSearch?.(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setIsSearchOpen(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
