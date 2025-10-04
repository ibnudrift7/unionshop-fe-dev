'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { type CarouselApi } from '@/components/ui/carousel';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeroSectionProps {
  searchPlaceholder?: string;
  images: string[];
  onSearch?: (value: string) => void;
}

export default function HeroSection({
  searchPlaceholder = 'Makna V4',
  images,
  onSearch,
}: HeroSectionProps) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setCount(api.scrollSnapList().length);
    };
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const next = !prev;
      if (!prev) {
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
          setApi={setApi}
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
                  'bg-white/50 hover:bg-white/60 text-brand backdrop-blur-sm h-8 w-10 sm:h-9 sm:w-12 border border-gray-200',
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
                <div
                  className={cn(
                    'relative h-8 md:h-9 flex-1 overflow-visible',
                    isSearchOpen
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none',
                  )}
                >
                  <Input
                    ref={searchInputRef}
                    placeholder={searchPlaceholder}
                    className={cn(
                      'pl-4 pr-3 bg-white/60 hover:bg-white/70 backdrop-blur-sm border-gray-200 h-full w-17/22 md:w-18/22 border-l-0 rounded-r-xl rounded-l-none relative z-10 transition-colors',
                      isSearchOpen ? 'shadow-sm' : '',
                    )}
                    onChange={(e) => onSearch?.(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsSearchOpen(false);
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value;
                        onSearch?.(value);
                      }
                    }}
                  />
                  <Button
                    type='button'
                    aria-label='Execute search'
                    className='absolute right-0 top-1/2 -translate-y-1/2 
                    h-7 md:h-8 w-[82px] md:w-[96px] 
                    bg-brand text-white 
                    rounded-r-lg rounded-l-none 
                    text-[10px] md:text-xs font-semibold tracking-wide 
                    hover:bg-brand/90  
                    z-[5] border border-brand/80'
                    onClick={() => {
                      const value = searchInputRef.current?.value || '';
                      onSearch?.(value);
                    }}
                  >
                    SEARCH
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='absolute left-5 bottom-11 sm:left-6 sm:bottom-14 flex items-center gap-1.5 sm:gap-2 z-10'>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              aria-current={current === i}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full border border-white/80 transition-colors',
                current === i ? 'bg-white' : 'bg-white/40 hover:bg-white/60',
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
